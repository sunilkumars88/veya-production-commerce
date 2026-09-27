'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Store, Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { api } from '../lib/api';

const CATEGORIES = [
  { name: 'Bras', slug: 'bras', color: 'from-[#7BBFB5] to-[#1A7A6E]' },
  { name: 'Panties', slug: 'panties', color: 'from-[#A8D4CE] to-[#2A9D8F]' },
  { name: 'Period', slug: 'period-wear', color: 'from-[#C5B4D3] to-[#7A6B8C]' },
  { name: 'Hygiene', slug: 'intimate-hygiene', color: 'from-[#9EC9C2] to-[#3A7A72]' },
  { name: 'Baby', slug: 'baby-kids', color: 'from-[#F0D9B5] to-[#C9A36A]' },
  { name: 'Wellness', slug: 'wellness', color: 'from-[#B7D4C5] to-[#4A8B73]' },
  { name: 'Active', slug: 'activewear', color: 'from-[#8FB8C9] to-[#3A6B7A]' },
  { name: 'Maternity', slug: 'maternity', color: 'from-[#E8C4C4] to-[#B07A7A]' },
];

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { api.getHomepage().then(setData).catch(console.error); }, []);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <section className="px-4 md:px-10 py-12 md:py-20 max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center min-h-[72vh]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span className="pill mb-5">India’s essentials marketplace</span>
          <h1 className="text-[2.6rem] md:text-[4.6rem] font-bold leading-[1.05] tracking-tight mt-5">
            Shop everything<br /><em className="font-serif text-teal italic font-semibold">she actually needs.</em>
          </h1>
          <p className="text-base md:text-lg text-ink-mute max-w-lg mt-6 leading-relaxed">
            Innerwear, period care, intimate hygiene, baby, and wellness — one cart, COD or Razorpay, dropship from partner warehouses.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/collections/best-sellers" className="bg-teal text-white px-7 py-3.5 rounded-full inline-flex items-center gap-2 text-sm font-semibold shadow-glow">
              Shop now <ArrowRight size={16} />
            </Link>
            <Link href="/sell" className="border border-teal/30 px-7 py-3.5 rounded-full text-sm font-medium text-teal hover:bg-teal/10">Sell on SakhiKart</Link>
          </div>
          <div className="flex flex-wrap gap-5 mt-8 text-xs text-ink-mute">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Razorpay + COD</span>
            <span className="inline-flex items-center gap-1.5"><Truck size={14} /> 3–5 day delivery</span>
            <span className="inline-flex items-center gap-1.5"><Store size={14} /> Vendor-ready</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[48vh] md:h-[58vh] rounded-[28px] overflow-hidden bg-gradient-to-br from-[#2A9D8F] via-[#1A7A6E] to-[#0D3D38] shadow-silk">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.28),transparent_42%)]" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-[11px] tracking-[.22em] uppercase text-white/70">Flipkart-style range · Calm Clearwave look</p>
            <p className="font-serif italic text-3xl md:text-5xl mt-2">One marketplace. Many homes.</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 md:px-10 py-8 max-w-[1280px] mx-auto">
        <p className="pill">Shop by category</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-8">Find it fast.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((c, i) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ delay: i * 0.04 }}
                className={`aspect-[5/4] rounded-2xl bg-gradient-to-br ${c.color} flex items-end p-4 shadow-sm`}
              >
                <span className="text-white font-semibold">{c.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {data?.bestSellers?.length > 0 && (
        <section className="px-4 md:px-10 py-16 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="pill">Trending</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">Best sellers</h2>
            </div>
            <Link href="/collections/best-sellers" className="text-sm text-teal font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {data.bestSellers.slice(0, 8).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {data?.newArrivals?.length > 0 && (
        <section className="px-4 md:px-10 py-8 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="pill">Just in</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">New arrivals</h2>
            </div>
            <Link href="/collections/new-arrivals" className="text-sm text-teal font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {data.newArrivals.slice(0, 8).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="bg-[#0D1E1C] text-white mx-4 md:mx-10 rounded-[28px] px-6 md:px-14 py-16 md:py-20 max-w-[1280px] md:mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-teal-light text-xs tracking-[.2em] uppercase">Built like a marketplace</p>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">Less fuss.<br /><em className="font-serif italic text-teal-light font-semibold">More feeling.</em></h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg text-white/65 max-w-xl">One storefront, many suppliers, ready for vendors. Payments, COD, inventory reservation and blind shipping already wired.</p>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[['Cart', 'One checkout'], ['Dropship', 'Partner SLAs'], ['Vendors', 'Coming next']].map(([a, b]) => (
                <div className="border-t border-white/15 pt-4" key={a}>
                  <Sparkles size={16} className="text-teal-light" />
                  <p className="mt-3 font-medium">{a}</p>
                  <p className="text-sm text-white/40 mt-1">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 py-16 max-w-[1280px] mx-auto grid md:grid-cols-3 gap-4">
        {[[Truck, 'Fast delivery', 'Track every shipment'], [ShieldCheck, 'Secure payments', 'Razorpay + COD'], [Store, 'Supplier network', 'Blind-ship private label']].map(([I, a, b]: any) => (
          <div className="bg-white rounded-3xl p-8 shadow-sm" key={a}>
            <I className="text-teal" />
            <h3 className="text-xl font-semibold mt-6">{a}</h3>
            <p className="text-ink-mute mt-2 text-sm">{b}</p>
          </div>
        ))}
      </section>

      {data?.reviews?.length > 0 && (
        <section className="px-4 md:px-10 py-8 max-w-[1280px] mx-auto">
          <p className="pill">Social proof</p>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-8">What customers say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {data.reviews.slice(0, 3).map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3 text-teal">{'★'.repeat(r.rating)}</div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-ink-mute mt-2">{r.body}</p>
                <p className="text-xs text-ink-mute/70 mt-4">{r.user?.name || 'Customer'} · {r.product?.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.faqs?.length > 0 && (
        <section className="px-4 md:px-10 py-16 max-w-[760px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">Questions?</h2>
          {data.faqs.map((f: any, i: number) => (
            <div key={f.id} className="border-b border-black/10">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-5 flex justify-between items-center text-left">
                <span className="font-medium pr-4">{f.question}</span>
                <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="pb-5 text-sm text-ink-mute leading-relaxed">{f.answer}</p>}
            </div>
          ))}
        </section>
      )}
      <Footer />
    </>
  );
}
