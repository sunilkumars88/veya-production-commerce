'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import { api } from '../../../../lib/api';

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Awaiting payment', PAID: 'Payment received', CONFIRMED: 'Order confirmed',
  SUPPLIER_ASSIGNED: 'Supplier assigned', PROCESSING: 'Processing', PACKED: 'Packed',
  SHIPPED: 'Shipped', OUT_FOR_DELIVERY: 'Out for delivery', DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled', RTO: 'Return to origin', RETURN_REQUESTED: 'Return requested',
  RETURNED: 'Returned', REFUNDED: 'Refunded',
};

export default function OrderDetailPage() {
  const { number } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (number) api.getOrder(number as string).then(setOrder).catch(console.error);
  }, [number]);

  if (!order) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-black/40">Loading order...</div></div>;

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
        <Link href="/account" className="text-sm text-black/50 hover:text-black">← Back to account</Link>
        <h1 className="font-serif text-3xl mt-4">Order #{order.orderNumber}</h1>
        <p className="text-sm text-black/50 mt-1">{STATUS_LABELS[order.status] || order.status}</p>

        {/* Timeline */}
        {order.statusHistory?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6">
            <h2 className="font-medium mb-4">Order timeline</h2>
            <div className="space-y-4">
              {order.statusHistory.map((h: any, i: number) => (
                <div key={h.id} className="flex gap-3 items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${i === order.statusHistory.length - 1 ? 'bg-black text-white' : 'bg-black/10'}`}>
                    {i < order.statusHistory.length - 1 ? '✓' : '→'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{STATUS_LABELS[h.newStatus] || h.newStatus}</p>
                    <p className="text-xs text-black/40">{new Date(h.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mt-6 bg-white rounded-2xl p-6">
          <h2 className="font-medium mb-4">Items</h2>
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between py-3 border-b border-black/5 text-sm">
              <span>{item.title} × {item.quantity}</span>
              <span>₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-black/50">Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-₹{order.discount}</span></div>}
            <div className="flex justify-between font-medium pt-2 border-t border-black/10"><span>Total</span><span>₹{order.total?.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="mt-6 bg-white rounded-2xl p-6">
            <h2 className="font-medium mb-2">Delivery address</h2>
            <p className="text-sm text-black/60">{(order.address as any).name}<br />{(order.address as any).line1}<br />{(order.address as any).city}, {(order.address as any).state} {(order.address as any).postalCode}</p>
          </div>
        )}

        {/* Tracking */}
        {order.fulfillment?.trackingNumber && (
          <div className="mt-6 bg-white rounded-2xl p-6">
            <h2 className="font-medium mb-2">Tracking</h2>
            <p className="text-sm">{order.fulfillment.carrier}: {order.fulfillment.trackingNumber}</p>
          </div>
        )}

        {order.status === 'DELIVERED' && (
          <button className="mt-6 w-full border border-black/20 py-3 rounded-full text-sm">Request return</button>
        )}
      </main>
      <Footer />
    </>
  );
}
