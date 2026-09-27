'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, updateQty, removeFromCart, cartTotal, CartItem } from '../lib/cart';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const total = cartTotal(items);
  const freeThreshold = 999;
  const toFree = Math.max(0, freeThreshold - total);

  useEffect(() => {
    if (open) setItems(getCart());
    const handler = () => setItems(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0D1E1C]/40 z-50" onClick={onClose} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32 }} className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[430px] bg-white shadow-2xl flex flex-col">
            <div className="p-6 flex justify-between items-center border-b border-black/5">
              <h2 className="text-2xl font-bold">Your cart</h2>
              <button onClick={onClose} aria-label="Close"><X size={22} /></button>
            </div>
            {toFree > 0 && items.length > 0 && (
              <div className="px-6 py-3 bg-mint text-sm text-center text-ink">
                You are <strong>₹{toFree}</strong> away from <strong>FREE SHIPPING</strong>
                <div className="mt-2 h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${Math.min(100, (total / freeThreshold) * 100)}%` }} />
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-ink-mute">
                  <p className="text-lg">Your cart is empty.</p>
                  <button onClick={onClose} className="mt-4 text-sm text-teal underline">Continue shopping</button>
                </div>
              ) : items.map(item => (
                <div key={item.variantId} className="py-4 border-b border-black/5 flex gap-4">
                  <div className="w-20 h-24 rounded-xl bg-mint flex-shrink-0 overflow-hidden">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-ink-mute mt-1">{item.size} · {item.color}</p>
                    <p className="mt-2 text-sm font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => setItems(updateQty(item.variantId, item.qty - 1))} className="w-7 h-7 rounded-full border border-black/15 flex items-center justify-center"><Minus size={12} /></button>
                      <span className="text-sm">{item.qty}</span>
                      <button onClick={() => setItems(updateQty(item.variantId, item.qty + 1))} className="w-7 h-7 rounded-full border border-black/15 flex items-center justify-center"><Plus size={12} /></button>
                      <button onClick={() => setItems(removeFromCart(item.variantId))} className="text-xs text-ink-mute ml-auto underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-black/5">
                <div className="flex justify-between mb-4 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link href="/checkout" onClick={onClose} className="block w-full bg-teal text-white py-4 rounded-full text-center text-sm font-semibold shadow-glow">
                  Checkout · ₹{total.toLocaleString('en-IN')}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
