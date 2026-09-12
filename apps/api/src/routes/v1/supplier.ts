import { Router } from 'express';
import { FulfillmentStatus, OrderStatus } from '@prisma/client';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';

const router = Router();

router.get('/orders', async (_req, res) => {
  try {
    const fulfillments = await db.fulfillment.findMany({
      include: { order: { include: { items: true } }, supplier: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, fulfillments);
  } catch (e) { sendError(res, e); }
});

router.get('/dashboard', async (_req, res) => {
  try {
    const [pending, processing, shipped, delivered] = await Promise.all([
      db.fulfillment.count({ where: { status: 'PENDING' } }),
      db.fulfillment.count({ where: { status: { in: ['ACCEPTED', 'PROCESSING', 'PACKED'] } } }),
      db.fulfillment.count({ where: { status: 'SHIPPED' } }),
      db.fulfillment.count({ where: { status: 'DELIVERED' } }),
    ]);
    sendSuccess(res, { pending, processing, shipped, delivered });
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/accept', async (req, res) => {
  try {
    const f = await db.fulfillment.update({ where: { id: req.params.id }, data: { status: FulfillmentStatus.ACCEPTED } });
    await db.order.update({ where: { id: f.orderId }, data: { status: OrderStatus.PROCESSING } });
    sendSuccess(res, f);
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/packed', async (req, res) => {
  try {
    const f = await db.fulfillment.update({ where: { id: req.params.id }, data: { status: FulfillmentStatus.PACKED } });
    await db.order.update({ where: { id: f.orderId }, data: { status: OrderStatus.PACKED } });
    sendSuccess(res, f);
  } catch (e) { sendError(res, e); }
});

router.post('/orders/:id/shipped', async (req, res) => {
  try {
    const { trackingNumber, carrier } = req.body;
    const f = await db.fulfillment.update({
      where: { id: req.params.id },
      data: { status: FulfillmentStatus.SHIPPED, trackingNumber, carrier: carrier || 'Courier' },
    });
    await db.order.update({ where: { id: f.orderId }, data: { status: OrderStatus.SHIPPED } });
    sendSuccess(res, f);
  } catch (e) { sendError(res, e); }
});

router.get('/inventory', async (_req, res) => {
  try {
    const inventory = await db.supplierProduct.findMany({
      include: { product: { select: { title: true, slug: true } }, supplier: { select: { name: true } } },
    });
    sendSuccess(res, inventory);
  } catch (e) { sendError(res, e); }
});

export default router;
