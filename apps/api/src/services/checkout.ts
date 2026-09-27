import { OrderStatus, PaymentStatus } from '@prisma/client';
import { db } from '../lib/db.js';
import { AppError } from '../lib/errors.js';
import { calculateCartPricing } from './pricing.js';
import { reserveInventory } from './inventory.js';
import { getSettingBool, getSettingInt } from '../lib/settings.js';
import type { PaymentProvider } from '../../../../packages/integrations/src/payment.js';

interface CheckoutInput {
  items: { variantId: string; quantity: number }[];
  address: any;
  billingAddress?: any;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'cod';
  userId?: string;
}

export async function createCheckout(input: CheckoutInput, paymentProvider: PaymentProvider) {
  const pricing = await calculateCartPricing(input.items, input.couponCode);

  if (input.paymentMethod === 'cod') {
    const codEnabled = await getSettingBool('cod.enabled', true);
    if (!codEnabled) throw new AppError('PAYMENT_FAILED', 'COD not available');
    const codMax = await getSettingInt('cod.max_amount', 5000);
    if (pricing.total > codMax) throw new AppError('PAYMENT_FAILED', `COD max ₹${codMax}`);
  }

  const orderNumber = `SK-${Date.now()}`;
  const ttlMinutes = await getSettingInt('reservation_ttl_minutes', 30);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: input.userId,
      status: input.paymentMethod === 'cod' ? OrderStatus.CONFIRMED : OrderStatus.PENDING_PAYMENT,
      paymentMethod: input.paymentMethod,
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      discount: pricing.discount,
      tax: pricing.tax,
      total: pricing.total,
      couponCode: pricing.appliedCoupon,
      address: input.address,
      billingAddress: input.billingAddress,
      expiresAt,
      items: {
        create: pricing.lines.map(l => ({
          productId: l.product.id,
          variantId: l.variant.id,
          title: l.product.title,
          sku: l.variant.sku,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      },
      statusHistory: {
        create: {
          newStatus: input.paymentMethod === 'cod' ? OrderStatus.CONFIRMED : OrderStatus.PENDING_PAYMENT,
          actorType: 'customer',
        },
      },
    },
    include: { items: true },
  });

  await reserveInventory(order.id, input.items);

  if (input.paymentMethod === 'cod') {
    const codFee = await getSettingInt('cod.fee', 0);
    await db.payment.create({
      data: { orderId: order.id, provider: 'cod', status: PaymentStatus.AUTHORIZED, amount: pricing.total + codFee },
    });
    if (pricing.appliedCoupon) {
      await db.coupon.update({ where: { code: pricing.appliedCoupon }, data: { usedCount: { increment: 1 } } });
    }
    return { orderId: order.id, orderNumber: order.orderNumber, total: pricing.total, cod: true };
  }

  const paymentOrder = await paymentProvider.createOrder({
    amount: pricing.total,
    currency: 'INR',
    receipt: order.orderNumber,
  });

  await db.payment.create({
    data: {
      orderId: order.id,
      provider: 'razorpay',
      providerOrderId: paymentOrder.providerOrderId,
      amount: pricing.total,
      status: PaymentStatus.CREATED,
    },
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    total: pricing.total,
    razorpayOrderId: paymentOrder.providerOrderId,
    razorpayKeyId: paymentOrder.keyId,
  };
}

export async function verifyPayment(
  orderId: string,
  providerOrderId: string,
  providerPaymentId: string,
  signature: string,
  paymentProvider: PaymentProvider,
) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order || !order.payment) throw new AppError('ORDER_NOT_FOUND', 'Order not found');

  const valid = paymentProvider.verifyPayment({
    orderId, providerOrderId, providerPaymentId, signature,
  });
  if (!valid) throw new AppError('INVALID_PAYMENT_SIGNATURE', 'Payment verification failed');

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: order.payment!.id },
      data: { status: PaymentStatus.CAPTURED, providerPaymentId },
    });
    await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.PAID } });
    await tx.orderStatusHistory.create({
      data: { orderId, previousStatus: order.status, newStatus: OrderStatus.PAID, actorType: 'system', reason: 'Payment captured' },
    });
    if (order.couponCode) {
      await tx.coupon.update({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } });
    }
  });

  const { consumeReservations } = await import('./inventory.js');
  await consumeReservations(orderId);

  return { verified: true, orderNumber: order.orderNumber };
}
