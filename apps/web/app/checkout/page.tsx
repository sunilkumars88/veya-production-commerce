'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { getCart, cartTotal, clearCart, CartItem } from '../../lib/cart';
import { api } from '../../lib/api';

declare global { interface Window { Razorpay: any; } }

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => { setItems(getCart()); }, []);

  const subtotal = cartTotal(items);
  const shipping = subtotal - couponDiscount >= 999 ? 0 : 79;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  const applyCoupon = async () => {
    try {
      const result = await api.applyCoupon(coupon, subtotal);
      if (result.valid) setCouponDiscount(result.discount);
      else setError(result.message);
    } catch (e: any) { setError(e.message); }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.createCheckout({
        items: items.map(i => ({ variantId: i.variantId, quantity: i.qty })),
        address: { ...address, country: 'IN' },
        couponCode: coupon || undefined,
        paymentMethod,
      });

      if (result.cod) {
        clearCart();
        setOrderResult(result);
        setStep(4);
        return;
      }

      if (result.razorpayOrderId && result.razorpayKeyId) {
        const options = {
          key: result.razorpayKeyId,
          amount: result.total,
          currency: 'INR',
          name: 'Body, Baby, Bloom',
          description: result.orderNumber,
          order_id: result.razorpayOrderId,
          handler: async (response: any) => {
            await api.verifyPayment({
              orderId: result.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            setOrderResult({ ...result, paid: true });
            setStep(4);
          },
          prefill: { name: address.name, contact: address.phone },
          theme: { color: '#151515' },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => setError('Payment failed. Please try again.'));
        rzp.open();
      } else {
        // Mock payment flow
        clearCart();
        setOrderResult(result);
        setStep(4);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-black/50 mb-4">Your bag is empty</p>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-full text-sm">Continue shopping</Link>
      </div>
    );
  }

  if (step === 4 && orderResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          <h1 className="font-serif text-3xl">Order confirmed!</h1>
          <p className="text-black/50 mt-3">Order #{orderResult.orderNumber}</p>
          <p className="text-sm text-black/40 mt-2">Total: ₹{orderResult.total?.toLocaleString('en-IN')}</p>
          <Link href={`/account/orders/${orderResult.orderNumber}`} className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-full text-sm">Track order</Link>
          <Link href="/" className="block mt-4 text-sm text-black/50 underline">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <main className="max-w-[1000px] mx-auto px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex gap-4 mb-8 text-sm">
          {['Address', 'Payment', 'Review'].map((s, i) => (
            <span key={s} className={`${step > i ? 'text-black font-medium' : 'text-black/40'}`}>{i + 1}. {s}</span>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h2 className="font-medium">Delivery address</h2>
                {['name', 'phone', 'line1', 'line2', 'city', 'state', 'postalCode'].map(field => (
                  <input key={field} value={(address as any)[field]} onChange={e => setAddress({ ...address, [field]: e.target.value })}
                    placeholder={field === 'postalCode' ? 'Pincode' : field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30" />
                ))}
                <button onClick={() => setStep(2)} disabled={!address.name || !address.phone || !address.line1 || !address.postalCode}
                  className="w-full bg-black text-white py-3 rounded-full text-sm disabled:opacity-40">Continue to payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h2 className="font-medium">Payment method</h2>
                <button onClick={() => setPaymentMethod('razorpay')} className={`w-full p-4 rounded-xl border text-left text-sm ${paymentMethod === 'razorpay' ? 'border-black bg-black/5' : 'border-black/10'}`}>
                  <p className="font-medium">Pay online</p>
                  <p className="text-black/50 text-xs mt-1">UPI, Cards, Net Banking via Razorpay</p>
                </button>
                <button onClick={() => setPaymentMethod('cod')} className={`w-full p-4 rounded-xl border text-left text-sm ${paymentMethod === 'cod' ? 'border-black bg-black/5' : 'border-black/10'}`}>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-black/50 text-xs mt-1">Pay when your order arrives</p>
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-black/20 py-3 rounded-full text-sm">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-black text-white py-3 rounded-full text-sm">Review order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h2 className="font-medium">Review & place order</h2>
                <div className="text-sm space-y-1 text-black/60">
                  <p>{address.name} · {address.phone}</p>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p className="mt-2">Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</p>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-black/20 py-3 rounded-full text-sm">Back</button>
                  <button onClick={placeOrder} disabled={loading} className="flex-1 bg-black text-white py-3 rounded-full text-sm disabled:opacity-40">
                    {loading ? 'Processing...' : `Place order · ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="font-medium mb-4">Order summary</h3>
              {items.map(item => (
                <div key={item.variantId} className="flex justify-between text-sm py-2 border-b border-black/5">
                  <span className="text-black/70">{item.title} × {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="mt-4 flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="BLOOM10" className="flex-1 border border-black/10 rounded-full px-4 py-2 text-sm outline-none" />
                <button onClick={applyCoupon} className="text-sm underline">Apply</button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-₹{couponDiscount}</span></div>}
                <div className="flex justify-between"><span className="text-black/50">Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-black/10"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
