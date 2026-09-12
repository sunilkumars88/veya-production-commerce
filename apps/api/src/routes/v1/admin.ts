import { Router } from 'express';
import { OrderStatus, FulfillmentStatus } from '@prisma/client';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';
import { requireAdmin } from '../../middleware/auth.js';
import { selectBestSupplier } from '../../services/supplier-scoring.js';
import { MockSupplierProvider } from '../../../../../packages/integrations/src/supplier.js';
import { MockShippingProvider } from '../../../../../packages/integrations/src/shipping.js';

const router = Router();
const supplierProvider = new MockSupplierProvider();
const shippingProvider = new MockShippingProvider();

router.use(requireAdmin);

router.get('/dashboard', async (_req, res) => {
  try {
    const [orders, revenue, products, lowStock] = await Promise.all([
      db.order.count(),
      db.order.aggregate({ _sum: { total: true }, where: { status: { in: ['PAID', 'CONFIRMED', 'DELIVERED', 'SHIPPED'] } } }),
      db.product.count({ where: { active: true } }),
      db.productVariant.count({ where: { active: true, stock: { lte: 10 } } }),
    ]);
    const recentOrders = await db.order.findMany({
      include: { items: true, payment: true, fulfillment: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const statusBreakdown = await db.order.groupBy({ by: ['status'], _count: true });
    sendSuccess(res, {
      kpis: {
        revenue: revenue._sum.total || 0,
        orders,
        products,
        lowStock,
        aov: orders > 0 ? Math.round((revenue._sum.total || 0) / orders) : 0,
      },
      recentOrders,
      statusBreakdown,
    });
  } catch (e) { sendError(res, e); }
});

router.get('/orders', async (req, res) => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (search) where.OR = [
      { orderNumber: { contains: String(search), mode: 'insensitive' } },
    ];
    const [items, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { items: true, payment: true, fulfillment: { include: { supplier: true } }, shipments: true },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      db.order.count({ where }),
    ]);
    sendSuccess(res, { items, total });
  } catch (e) { sendError(res, e); }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: true, payment: true, fulfillment: { include: { supplier: true } },
        shipments: true, returns: true, statusHistory: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Not found' } });
    sendSuccess(res, order);
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/fulfill', async (req, res) => {
  try {
    const order = await db.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Not found' } });

    const firstItem = order.items[0];
    const best = firstItem ? await selectBestSupplier(firstItem.productId) : null;
    const supplier = best
      ? await db.supplier.findUnique({ where: { id: best.supplierId } })
      : await db.supplier.findFirst({ where: { active: true } });
    if (!supplier) return res.status(400).json({ success: false, error: { code: 'SUPPLIER_UNAVAILABLE', message: 'No supplier' } });

    const ext = await supplierProvider.createOrder({ orderNumber: order.orderNumber, items: order.items, address: order.address });
    const fulfillment = await db.fulfillment.upsert({
      where: { orderId: order.id },
      update: { supplierId: supplier.id, status: FulfillmentStatus.ACCEPTED, supplierScore: best?.score, raw: ext },
      create: { orderId: order.id, supplierId: supplier.id, status: FulfillmentStatus.ACCEPTED, supplierScore: best?.score, raw: ext },
    });

    await db.order.update({ where: { id: order.id }, data: { status: OrderStatus.SUPPLIER_ASSIGNED } });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, previousStatus: order.status, newStatus: OrderStatus.SUPPLIER_ASSIGNED, actorType: 'admin', metadata: { supplierId: supplier.id, score: best?.score } },
    });

    sendSuccess(res, fulfillment);
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } });
    }
    const order = await db.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Not found' } });

    const updated = await db.order.update({ where: { id: req.params.id }, data: { status } });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, previousStatus: order.status, newStatus: status, actorType: 'admin', reason },
    });
    await db.auditLog.create({ data: { action: 'STATUS_CHANGE', entity: 'order', entityId: order.id, metadata: { status, reason } } });
    sendSuccess(res, updated);
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/ship', async (req, res) => {
  try {
    const order = await db.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Not found' } });

    const result = await shippingProvider.createShipment({
      orderNumber: order.orderNumber,
      name: (order.address as any)?.name || 'Customer',
      phone: (order.address as any)?.phone || '',
      address: order.address,
      items: order.items,
      cod: order.paymentMethod === 'cod',
      amount: order.total,
    });

    const shipment = await db.shipment.create({
      data: { orderId: order.id, awb: result.awb, carrier: result.provider, status: 'IN_TRANSIT', eta: new Date(Date.now() + result.etaDays * 86400000), raw: result as any },
    });

    await db.fulfillment.update({
      where: { orderId: order.id },
      data: { status: FulfillmentStatus.SHIPPED, trackingNumber: result.awb, carrier: result.provider },
    });
    await db.order.update({ where: { id: order.id }, data: { status: OrderStatus.SHIPPED } });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, previousStatus: order.status, newStatus: OrderStatus.SHIPPED, actorType: 'admin', metadata: { awb: result.awb } },
    });

    sendSuccess(res, shipment);
  } catch (e) { sendError(res, e); }
});

router.get('/products', async (_req, res) => {
  try {
    const products = await db.product.findMany({
      include: { variants: true, images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, products);
  } catch (e) { sendError(res, e); }
});

router.get('/customers', async (_req, res) => {
  try {
    const customers = await db.user.findMany({
      where: { role: 'CUSTOMER' },
      include: { orders: { take: 5, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    sendSuccess(res, customers);
  } catch (e) { sendError(res, e); }
});

router.get('/settings', async (_req, res) => {
  try {
    const settings = await db.setting.findMany();
    sendSuccess(res, settings);
  } catch (e) { sendError(res, e); }
});

router.put('/settings', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await db.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } });
    }
    sendSuccess(res, { updated: true });
  } catch (e) { sendError(res, e); }
});

router.get('/audit-logs', async (_req, res) => {
  try {
    const logs = await db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { user: { select: { name: true, email: true } } } });
    sendSuccess(res, logs);
  } catch (e) { sendError(res, e); }
});

export default router;
