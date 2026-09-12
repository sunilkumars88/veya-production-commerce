import { Router } from 'express';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';
import { returnRequestSchema } from '../../../../../packages/validation/src/index.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/:number', optionalAuth, async (req, res) => {
  try {
    const order = await db.order.findUnique({
      where: { orderNumber: String(req.params.number) },
      include: {
        items: true,
        payment: true,
        fulfillment: { include: { supplier: true } },
        shipments: true,
        returns: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
    sendSuccess(res, order);
  } catch (e) { sendError(res, e); }
});

router.post('/returns', optionalAuth, async (req, res) => {
  try {
    const parsed = returnRequestSchema.parse(req.body);
    const order = await db.order.findUnique({ where: { orderNumber: parsed.orderNumber }, include: { items: true } });
    if (!order) return res.status(404).json({ success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' } });
    if (!['DELIVERED', 'SHIPPED'].includes(order.status)) {
      return res.status(400).json({ success: false, error: { code: 'RETURN_NOT_ELIGIBLE', message: 'Order not eligible for return' } });
    }

    const returnReq = await db.returnRequest.create({
      data: {
        orderId: order.id,
        reason: parsed.reason,
        itemIds: parsed.itemIds,
        pickupAddress: parsed.pickupAddress,
        exchangeVariantId: parsed.exchangeVariantId,
      },
    });

    await db.order.update({ where: { id: order.id }, data: { status: 'RETURN_REQUESTED' } });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, previousStatus: order.status, newStatus: 'RETURN_REQUESTED', actorType: 'customer' },
    });

    sendSuccess(res, returnReq, 201);
  } catch (e) { sendError(res, e); }
});

export default router;
