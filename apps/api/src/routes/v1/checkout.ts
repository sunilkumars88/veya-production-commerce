import { Router } from 'express';
import crypto from 'crypto';
import { checkoutSchema, paymentVerifySchema } from '../../../../../packages/validation/src/index.js';
import { createCheckout, verifyPayment } from '../../services/checkout.js';
import { validateCoupon } from '../../services/pricing.js';
import { sendError, sendSuccess } from '../../lib/errors.js';
import { rateLimit } from '../../middleware/rate-limit.js';
import { optionalAuth } from '../../middleware/auth.js';
import { MockShippingProvider } from '../../../../../packages/integrations/src/shipping.js';
import { getSettingBool, getSettingInt } from '../../lib/settings.js';
import type { PaymentProvider } from '../../../../../packages/integrations/src/payment.js';

const router = Router();
const shipping = new MockShippingProvider();

export function createCheckoutRouter(paymentProvider: PaymentProvider) {
  router.post('/create', rateLimit(10, 60_000), optionalAuth, async (req, res) => {
    try {
      const parsed = checkoutSchema.parse(req.body);
      const result = await createCheckout({
        ...parsed,
        userId: (req as any).user?.id,
      }, paymentProvider);
      sendSuccess(res, result, 201);
    } catch (e) { sendError(res, e); }
  });

  router.post('/verify', rateLimit(10, 60_000), async (req, res) => {
    try {
      const parsed = paymentVerifySchema.parse(req.body);
      const result = await verifyPayment(
        parsed.orderId, parsed.razorpay_order_id, parsed.razorpay_payment_id, parsed.razorpay_signature,
        paymentProvider,
      );
      sendSuccess(res, result);
    } catch (e) { sendError(res, e); }
  });

  router.post('/coupon', rateLimit(20, 60_000), async (req, res) => {
    try {
      const result = await validateCoupon(req.body.code, req.body.subtotal);
      sendSuccess(res, result);
    } catch (e) { sendError(res, e); }
  });

  router.get('/pincode/:pincode', async (req, res) => {
    try {
      const amount = Number(req.query.amount) || 0;
      const result = await shipping.checkServiceability(req.params.pincode, amount);
      const freeThreshold = await getSettingInt('shipping.free_threshold', 999);
      const codEnabled = await getSettingBool('cod.enabled', true);
      const codMax = await getSettingInt('cod.max_amount', 5000);
      sendSuccess(res, {
        ...result,
        freeShippingThreshold: freeThreshold,
        amountToFreeShipping: Math.max(0, freeThreshold - amount),
        codAvailable: codEnabled && result.codAvailable && amount <= codMax,
      });
    } catch (e) { sendError(res, e); }
  });

  return router;
}

export default router;
