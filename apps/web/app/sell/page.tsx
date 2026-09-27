'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/CartDrawer';
import { useState } from 'react';

export default function SellPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="max-w-[900px] mx-auto px-4 md:px-10 py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="pill">Marketplace</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-5">Sell on Body, Baby, Bloom</h1>
          <p className="text-ink-mute mt-4 text-lg max-w-2xl leading-relaxed">
            Today we list original house brands via dropship suppliers. Next, verified vendors can add products — Flipkart-style — with KYC, inventory, and payouts.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[['1. Apply', 'Share GSTIN, catalogue and warehouse city.'], ['2. List', 'SKUs sync to the storefront with your cost, not your branding.'], ['3. Fulfil', 'Accept, pack, ship. We own the customer experience.']].map(([t, d]) => (
            <div key={t} className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="font-semibold text-teal">{t}</p>
              <p className="text-sm text-ink-mute mt-2">{d}</p>
            </div>
          ))}
        </div>
        <form className="mt-12 bg-white rounded-3xl p-8 shadow-sm space-y-4" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <h2 className="text-xl font-semibold">Vendor interest form</h2>
          <input required placeholder="Brand / company name" className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm" />
          <input required type="email" placeholder="Work email" className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm" />
          <input placeholder="GSTIN (optional)" className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm" />
          <textarea placeholder="What categories will you sell?" className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm min-h-[100px]" />
          <button className="bg-teal text-white px-6 py-3 rounded-full text-sm font-semibold shadow-glow">Submit interest</button>
          {sent && <p className="text-sm text-teal">Thanks — we will enable public listings after KYC. Use the Supplier portal for fulfilment today.</p>}
        </form>
        <p className="text-sm text-ink-mute mt-6">Already a partner? <Link href="/supplier" className="text-teal underline">Open supplier portal</Link></p>
      </main>
      <Footer />
    </>
  );
}
