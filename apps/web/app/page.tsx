'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Heart, Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { api } from '../lib/api';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { api.getHomepage().then(setData).catch(console.error); }, []);

  const categories = [
    { name: 'Bras', slug: 'bras', color: 'from-[#d8b9ac] to-[#c9a090]' },
    { name: 'Panties', slug: 'panties', color: 'from-[#b99a8e] to-[#a08070]' },
    { name: 'Period', slug: 'period', color: 'from-[#c4a0a0] to-[#b08080]' },
    { name: 'Activewear', slug: 'activewear', color: 'from-[#a0b0a0] to-[#809080]' },
    { name: 'Nightwear', slug: 'nightwear', color: 'from-[#a0a0c0] to-[#8080a0]' },
    { name: 'Girls', slug: 'girls', color: 'from-[#d0c0a0] to-[#c0b090]' },
  ];

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <section className="px-4 md:px-14 py-10 md:py-20 grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] max-w-[1440px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="uppercase tracking-[.3em] text-xs text-black/50">The everyday edit</p>
          <h1 className="font-serif text-[3rem] md:text-[5.5rem] lg:text-[7rem] leading-[.88] mt-4">Comfort<br /><i>that moves.</i></h1>
          <p className="text-base md:text-lg text-black/55 max-w-lg mt-6">Premium essentials designed around real bodies, real routines and repeat wear.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/collections/best-sellers" className="bg-black text-white px-6 md:px-7 py-3.5 md:py-4 rounded-full inline-flex items-center gap-3 text-sm">Shop collection <ArrowRight size={16} /></Link>
            <Link href="#story" className="border border-black/20 px-6 md:px-7 py-3.5 md:py-4 rounded-full text-sm">Discover Veya</Link>
          </div>
        </motion.div>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-[50vh] md:h-[62vh] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#d8b9ac] via-[#eee1d9] to-[#b99a8e] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(255,255,255,.85),transparent_35%)]" />
          <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 text-white">
            <p className="tracking-[.25em] text-[10px] md:text-xs uppercase">Soft. Strong. Yours.</p>
            <p className="font-serif text-2xl md:text-4xl mt-2">Made for everyday.</p>
          </div>
        </motion.div>
      </section>

      {/* Shop by category */}
      <section className="px-4 md:px-14 py-16 max-w-[1440px] mx-auto">
        <p className="uppercase tracking-[.25em] text-xs text-black/50">Shop by category</p>
        <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-8">Find your fit.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((c, i) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`aspect-square rounded-2xl bg-gradient-to-br ${c.color} flex items-end p-4 hover:scale-[1.02] transition-transform`}>
                <span className="text-white font-medium text-sm md:text-base">{c.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      {data?.bestSellers?.length > 0 && (
        <section className="px-4 md:px-14 py-16 max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div><p className="uppercase tracking-[.25em] text-xs text-black/50">Trending</p><h2 className="font-serif text-3xl md:text-5xl mt-3">Best sellers</h2></div>
            <Link href="/collections/best-sellers" className="text-sm text-black/50 hover:text-black">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-12">
            {data.bestSellers.slice(0, 4).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* New arrivals */}
      {data?.newArrivals?.length > 0 && (
        <section className="px-4 md:px-14 py-16 max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div><p className="uppercase tracking-[.25em] text-xs text-black/50">Just dropped</p><h2 className="font-serif text-3xl md:text-5xl mt-3">New arrivals</h2></div>
            <Link href="/collections/new-arrivals" className="text-sm text-black/50 hover:text-black">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-12">
            {data.newArrivals.slice(0, 4).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Story */}
      <section id="story" className="bg-black text-white px-4 md:px-14 py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 md:gap-16">
          <div>
            <p className="text-white/40 uppercase tracking-[.25em] text-xs">The Veya standard</p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-8xl mt-4">Less fuss.<br /><i>More feeling.</i></h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg md:text-2xl text-white/65 max-w-xl">A commerce system built around comfort, transparency and a better after-purchase experience — from supplier to doorstep.</p>
            <div className="grid grid-cols-3 gap-4 mt-10 md:mt-12">
              {[['Fit', 'Thoughtful cuts'], ['Care', 'Easy exchange'], ['Flow', 'Fast fulfilment']].map(([a, b]) => (
                <div className="border-t border-white/20 pt-4" key={a}>
                  <Sparkles size={17} />
                  <p className="mt-3 md:mt-4 text-sm md:text-base">{a}</p>
                  <p className="text-xs md:text-sm text-white/40 mt-1">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 md:px-14 py-16 max-w-[1440px] mx-auto grid md:grid-cols-3 gap-4 md:gap-5">
        {[[Truck, 'Fast delivery', 'Track every shipment'], [ShieldCheck, 'Secure payments', 'Razorpay protected'], [Heart, 'Human support', 'Care after checkout']].map(([I, a, b]: any) => (
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8" key={a}>
            <I size={24} />
            <h3 className="text-lg md:text-xl mt-6 md:mt-8">{a}</h3>
            <p className="text-black/50 mt-2 text-sm">{b}</p>
          </div>
        ))}
      </section>

      {/* Reviews */}
      {data?.reviews?.length > 0 && (
        <section className="px-4 md:px-14 py-16 max-w-[1440px] mx-auto">
          <p className="uppercase tracking-[.25em] text-xs text-black/50">Real voices</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-8">What customers say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {data.reviews.slice(0, 3).map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl p-6">
                <div className="flex gap-1 mb-3">{Array.from({ length: r.rating }).map((_, i) => <span key={i} className="text-[#d76d6d]">★</span>)}</div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-black/60 mt-2">{r.body}</p>
                <p className="text-xs text-black/40 mt-4">{r.user?.name || 'Customer'} · {r.product?.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {data?.faqs?.length > 0 && (
        <section className="px-4 md:px-14 py-16 max-w-[800px] mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-8">Questions?</h2>
          {data.faqs.map((f: any, i: number) => (
            <div key={f.id} className="border-b border-black/10">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-5 flex justify-between items-center text-left">
                <span className="font-medium text-sm md:text-base pr-4">{f.question}</span>
                <ChevronDown size={18} className={`transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="pb-5 text-sm text-black/60 leading-relaxed">{f.answer}</p>}
            </div>
          ))}
        </section>
      )}

      <Footer />
    </>
  );
}
