import { db } from '../lib/db.js';
import { AppError } from '../lib/errors.js';
import { getSettingInt } from '../lib/settings.js';

export async function reserveInventory(
  orderId: string,
  items: { variantId: string; quantity: number }[],
) {
  const ttlMinutes = await getSettingInt('reservation_ttl_minutes', 30);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

  return db.$transaction(async (tx) => {
    for (const item of items) {
      const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant) throw new AppError('VARIANT_OUT_OF_STOCK', 'Variant not found');
      const available = variant.stock - variant.reserved;
      if (available < item.quantity) {
        throw new AppError('VARIANT_OUT_OF_STOCK', `${variant.sku} insufficient stock`);
      }
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { reserved: { increment: item.quantity } },
      });
      await tx.inventoryReservation.create({
        data: { orderId, variantId: item.variantId, quantity: item.quantity, expiresAt },
      });
    }
  });
}

export async function releaseReservations(orderId: string) {
  const reservations = await db.inventoryReservation.findMany({
    where: { orderId, status: 'ACTIVE' },
  });

  await db.$transaction(async (tx) => {
    for (const r of reservations) {
      await tx.productVariant.update({
        where: { id: r.variantId },
        data: { reserved: { decrement: r.quantity } },
      });
      await tx.inventoryReservation.update({
        where: { id: r.id },
        data: { status: 'RELEASED' },
      });
    }
  });
}

export async function consumeReservations(orderId: string) {
  const reservations = await db.inventoryReservation.findMany({
    where: { orderId, status: 'ACTIVE' },
  });

  await db.$transaction(async (tx) => {
    for (const r of reservations) {
      await tx.productVariant.update({
        where: { id: r.variantId },
        data: {
          stock: { decrement: r.quantity },
          reserved: { decrement: r.quantity },
        },
      });
      await tx.inventoryReservation.update({
        where: { id: r.id },
        data: { status: 'CONSUMED' },
      });
    }
  });
}

export async function expireStaleReservations() {
  const stale = await db.inventoryReservation.findMany({
    where: { status: 'ACTIVE', expiresAt: { lt: new Date() } },
  });

  for (const r of stale) {
    await db.$transaction(async (tx) => {
      await tx.productVariant.update({
        where: { id: r.variantId },
        data: { reserved: { decrement: r.quantity } },
      });
      await tx.inventoryReservation.update({
        where: { id: r.id },
        data: { status: 'EXPIRED' },
      });
      if (r.orderId) {
        const order = await tx.order.findUnique({ where: { id: r.orderId } });
        if (order?.status === 'PENDING_PAYMENT') {
          await tx.order.update({ where: { id: r.orderId }, data: { status: 'CANCELLED' } });
          await tx.orderStatusHistory.create({
            data: { orderId: r.orderId, previousStatus: 'PENDING_PAYMENT', newStatus: 'CANCELLED', reason: 'Payment timeout', actorType: 'system' },
          });
        }
      }
    });
  }
  return stale.length;
}
