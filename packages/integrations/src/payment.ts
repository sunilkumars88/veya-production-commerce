import crypto from 'crypto';

export interface PaymentOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
}

export interface PaymentVerifyRequest {
  orderId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface PaymentProvider {
  createOrder(req: PaymentOrderRequest): Promise<PaymentOrderResult>;
  verifyPayment(req: PaymentVerifyRequest): boolean;
  refund(paymentId: string, amount: number): Promise<{ refundId: string }>;
}

export class RazorpayPaymentProvider implements PaymentProvider {
  private razor: any;
  private keySecret: string;
  private keyId: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
    // Dynamic import handled at runtime
    this.razor = null;
  }

  private async getRazorpay() {
    if (!this.razor) {
      const Razorpay = (await import('razorpay')).default;
      this.razor = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    }
    return this.razor;
  }

  async createOrder(req: PaymentOrderRequest): Promise<PaymentOrderResult> {
    const razor = await this.getRazorpay();
    const order = await razor.orders.create({
      amount: req.amount,
      currency: req.currency,
      receipt: req.receipt,
      notes: req.notes,
    });
    return { providerOrderId: order.id, amount: req.amount, currency: req.currency, keyId: this.keyId };
  }

  verifyPayment(req: PaymentVerifyRequest): boolean {
    const payload = `${req.providerOrderId}|${req.providerPaymentId}`;
    const expected = crypto.createHmac('sha256', this.keySecret).update(payload).digest('hex');
    return expected === req.signature;
  }

  async refund(paymentId: string, amount: number) {
    const razor = await this.getRazorpay();
    const refund = await razor.payments.refund(paymentId, { amount });
    return { refundId: refund.id };
  }
}

export class MockPaymentProvider implements PaymentProvider {
  async createOrder(req: PaymentOrderRequest): Promise<PaymentOrderResult> {
    return { providerOrderId: `mock_${Date.now()}`, amount: req.amount, currency: req.currency };
  }
  verifyPayment(_req: PaymentVerifyRequest): boolean { return true; }
  async refund(_paymentId: string, _amount: number) { return { refundId: `mock_refund_${Date.now()}` }; }
}
