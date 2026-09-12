import { Router } from 'express';
import crypto from 'crypto';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { db } from '../../lib/db.js';

const router = Router();

async function persistWebhook(provider: string, eventId: string, type: string, payload: any, rawBody: Buffer) {
  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');
  try {
    await db.webhookEvent.create({
      data: { provider, eventId, type, payload, payloadHash, status: 'RECEIVED' },
    });
    return true;
  } catch {
    return false;
  }
}

router.post('/razorpay', async (req: any, res) => {
  const sig = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (secret) {
    const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
    if (expected !== sig) return res.status(401).json({ error: 'Invalid signature' });
  }

  const eventId = String(req.headers['x-razorpay-event-id'] || crypto.createHash('sha256').update(req.rawBody).digest('hex'));
  const isNew = await persistWebhook('razorpay', eventId, req.body.event, req.body, req.rawBody);
  if (!isNew) return res.json({ received: true, duplicate: true });

  try {
    const payment = req.body.payload?.payment?.entity;
    if (payment?.order_id) {
      const pay = await db.payment.findFirst({ where: { providerOrderId: payment.order_id } });
      if (pay && req.body.event === 'payment.captured' && pay.status !== PaymentStatus.CAPTURED) {
        await db.payment.update({
          where: { id: pay.id },
          data: { status: PaymentStatus.CAPTURED, providerPaymentId: payment.id, raw: req.body },
        });
        await db.order.update({ where: { id: pay.orderId }, data: { status: OrderStatus.PAID } });
        await db.orderStatusHistory.create({
          data: { orderId: pay.orderId, newStatus: OrderStatus.PAID, actorType: 'webhook', reason: 'payment.captured' },
        });
      }
    }
    await db.webhookEvent.update({ where: { eventId }, data: { status: 'PROCESSED', processedAt: new Date() } });
  } catch (e: any) {
    await db.webhookEvent.update({ where: { eventId }, data: { status: 'FAILED', error: e.message } });
  }

  res.json({ received: true });
});

router.post('/shipping', async (req: any, res) => {
  const eventId = String(req.headers['x-event-id'] || crypto.createHash('sha256').update(req.rawBody).digest('hex'));
  const isNew = await persistWebhook('shipping', eventId, req.body.type || 'update', req.body, req.rawBody);
  if (!isNew) return res.json({ received: true, duplicate: true });

  try {
    const { awb, status, orderNumber } = req.body;
    if (awb) {
      const shipment = await db.shipment.findFirst({ where: { awb } });
      if (shipment) {
        const statusMap: Record<string, any> = {
          delivered: 'DELIVERED', in_transit: 'IN_TRANSIT', out_for_delivery: 'OUT_FOR_DELIVERY', rto: 'RTO',
        };
        const mapped = statusMap[status?.toLowerCase()] || shipment.status;
        await db.shipment.update({ where: { id: shipment.id }, data: { status: mapped, trackingEvents: req.body.events } });
        if (mapped === 'DELIVERED') {
          await db.order.update({ where: { id: shipment.orderId }, data: { status: OrderStatus.DELIVERED } });
        }
      }
    }
    await db.webhookEvent.update({ where: { eventId }, data: { status: 'PROCESSED', processedAt: new Date() } });
  } catch (e: any) {
    await db.webhookEvent.update({ where: { eventId }, data: { status: 'FAILED', error: e.message } });
  }

  res.json({ received: true });
});

export default router;
