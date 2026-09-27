import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { config, validateProductionConfig } from '../../../packages/config/src/index.js';
import { RazorpayPaymentProvider, MockPaymentProvider } from '../../../packages/integrations/src/payment.js';
import { db } from './lib/db.js';
import { sendError } from './lib/errors.js';
import { expireStaleReservations } from './services/inventory.js';

import productsRouter from './routes/v1/products.js';
import { createCheckoutRouter } from './routes/v1/checkout.js';
import ordersRouter from './routes/v1/orders.js';
import catalogRouter from './routes/v1/catalog.js';
import sizeRouter from './routes/v1/size.js';
import adminRouter from './routes/v1/admin.js';
import supplierRouter from './routes/v1/supplier.js';
import webhooksRouter from './routes/v1/webhooks.js';
import shopifyRouter from './routes/v1/shopify.js';

validateProductionConfig();

const paymentProvider = config.razorpay.enabled
  ? new RazorpayPaymentProvider(config.razorpay.keyId, config.razorpay.keySecret)
  : new MockPaymentProvider();

const app = express();

app.use(cors({ origin: config.cors.origin }));
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  (req as any).requestId = requestId;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf; } }));

// Health
app.get('/health', (_q, r) => r.json({ ok: true, service: 'body-baby-bloom-api', version: '1.0.0' }));
app.get('/ready', async (_q, r) => {
  try {
    await db.$queryRaw`SELECT 1`;
    r.json({ ready: true });
  } catch {
    r.status(503).json({ ready: false });
  }
});

// API v1
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/checkout', createCheckoutRouter(paymentProvider));
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/size', sizeRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/supplier', supplierRouter);
app.use('/api/v1/webhooks', webhooksRouter);
app.use('/api/v1/shopify', shopifyRouter);

// Legacy routes (backward compat)
app.get('/products', async (_q, r) => {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true, images: true, category: true },
    orderBy: { createdAt: 'desc' },
  });
  r.json(products);
});
app.get('/products/:slug', async (q, r) => {
  const p = await db.product.findUnique({
    where: { slug: q.params.slug },
    include: { variants: true, images: true, category: true, reviews: { where: { approved: true } } },
  });
  p ? r.json(p) : r.status(404).json({ error: 'Product not found' });
});
app.get('/admin/orders', async (_q, r) => r.json(await db.order.findMany({ include: { items: true, payment: true, fulfillment: true }, orderBy: { createdAt: 'desc' }, take: 200 })));
app.get('/supplier/orders', async (_q, r) => r.json(await db.fulfillment.findMany({ include: { order: { include: { items: true } }, supplier: true }, orderBy: { createdAt: 'desc' } })));

// Error handler
app.use((err: any, req: any, res: any, _next: any) => {
  sendError(res, err, req.requestId);
});

// Scheduled: expire stale reservations every 5 min
setInterval(() => expireStaleReservations().catch(console.error), 5 * 60_000);

app.listen(config.apiPort, () => {
  console.log(`Body, Baby, Bloom API running on :${config.apiPort}`);
  console.log(`Payment: ${config.razorpay.enabled ? 'Razorpay' : 'Mock'}`);
  console.log(`Shipping: ${config.shipping.provider}`);
});
