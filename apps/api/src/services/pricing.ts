import { db } from '../lib/db.js';
import { getSettingInt } from '../lib/settings.js';
import { AppError } from '../lib/errors.js';

export async function calculateCartPricing(items: { variantId: string; quantity: number }[], couponCode?: string) {
  const variants = await db.productVariant.findMany({
    where: { id: { in: items.map(i => i.variantId) }, active: true },
    include: { product: true },
  });

  const lines = items.map(item => {
    const v = variants.find(z => z.id === item.variantId);
    if (!v) throw new AppError('VARIANT_OUT_OF_STOCK', 'Product variant not found');
    const available = v.stock - v.reserved;
    if (available < item.quantity) throw new AppError('VARIANT_OUT_OF_STOCK', `${v.sku} has only ${available} available`);
    const unitPrice = v.price ?? v.product.price;
    return { variant: v, product: v.product, quantity: Math.max(1, item.quantity), unitPrice };
  });

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  let discount = 0;
  let appliedCoupon: string | null = null;

  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon || !coupon.active) throw new AppError('COUPON_INVALID', 'Invalid coupon code');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError('COUPON_INVALID', 'Coupon has expired');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new AppError('COUPON_INVALID', 'Coupon usage limit reached');
    if (subtotal < coupon.minOrder) throw new AppError('COUPON_INVALID', `Minimum order ₹${coupon.minOrder} required`);

    discount = coupon.type === 'PERCENT'
      ? Math.floor(subtotal * coupon.value / 100)
      : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    appliedCoupon = coupon.code;
  }

  const freeThreshold = await getSettingInt('shipping.free_threshold', 999);
  const defaultShipping = await getSettingInt('shipping.default_cost', 79);
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= freeThreshold ? 0 : defaultShipping;
  const taxRate = await getSettingInt('tax.default_rate', 5);
  const taxable = afterDiscount;
  const tax = Math.floor(taxable * taxRate / 100);
  const total = Math.max(0, afterDiscount + shipping + tax);

  return {
    lines,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedCoupon,
    freeShippingThreshold: freeThreshold,
    amountToFreeShipping: Math.max(0, freeThreshold - afterDiscount),
  };
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active) return { valid: false, message: 'Invalid coupon' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, message: 'Expired' };
  if (subtotal < coupon.minOrder) return { valid: false, message: `Min order ₹${coupon.minOrder}` };
  const discount = coupon.type === 'PERCENT' ? Math.floor(subtotal * coupon.value / 100) : coupon.value;
  return { valid: true, discount: coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount, code: coupon.code };
}
