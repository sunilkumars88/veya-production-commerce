'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, cartCount } from '../lib/cart';
import Logo, { BRAND } from './Logo';

const NAV = [
  { label: 'Innerwear', href: '/category/innerwear', children: [
    { label: 'Bras', href: '/category/bras' },
    { label: 'Panties', href: '/category/panties' },
    { label: 'Nightwear', href: '/category/nightwear' },
    { label: 'Activewear', href: '/category/activewear' },
    { label: 'Maternity', href: '/category/maternity' },
  ]},
  { label: 'Period', href: '/category/period', children: [
    { label: 'Period Wear', href: '/category/period-wear' },
    { label: 'Period Care', href: '/category/period-care' },
  ]},
  { label: 'Hygiene', href: '/category/intimate-hygiene' },
  { label: 'Baby', href: '/category/baby-kids', children: [
    { label: 'Cloth Diapers', href: '/category/cloth-diapers' },
    { label: 'Baby Care', href: '/category/baby-care' },
    { label: 'Baby Wear', href: '/category/baby-wear' },
    { label: 'Girls', href: '/category/girls-briefs' },
  ]},
  { label: 'Wellness', href: '/category/wellness' },
  { label: 'Deals', href: '/collections/sale' },
];

export default function Header({ onCartOpen }: { onCartOpen?: () => void }) {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setCount(cartCount(getCart()));
    update();
    window.addEventListener('cart-updated', update);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <>
      <div className="bg-teal text-white text-center py-2 px-3 text-[11px] md:text-xs font-medium">
        {BRAND.tagline} <span className="hidden md:inline text-white/70"> · Free shipping above ₹999 · COD</span>
      </div>
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#E8F4F2]/92 backdrop-blur-xl shadow-sm' : 'bg-[#E8F4F2]/80 backdrop-blur-md'}`}>
        <div className="h-[100px] md:h-[112px] px-4 md:px-10 flex items-center justify-between max-w-[1280px] mx-auto gap-3">
          <button className="lg:hidden p-2 shrink-0" onClick={() => setMobileOpen(true)} aria-label="Menu"><Menu size={22} /></button>
          <Logo variant="header" showTagline />

          <nav className="hidden lg:flex items-center gap-1 text-[15px] font-medium">
            {NAV.map(item => (
              <div key={item.label} className="relative" onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
                <Link href={item.href} className="flex items-center gap-1 px-3 py-2 rounded-full text-ink-mute hover:text-teal hover:bg-teal/10">
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                {item.children && activeMenu === item.label && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 bg-white rounded-2xl shadow-silk p-5 min-w-[200px] border border-black/5">
                    {item.children.map(c => (
                      <Link key={c.label} href={c.href} className="block py-2 text-sm text-ink-mute hover:text-teal">{c.label}</Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Link href="/sell" className="hidden md:inline-flex items-center gap-1 text-sm text-ink-mute hover:text-teal px-3 py-2"><Store size={16} /> Sell</Link>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-ink-mute hover:text-teal" aria-label="Search"><Search size={18} /></button>
            <Link href="/account" className="hidden md:block p-2 text-ink-mute hover:text-teal" aria-label="Account"><Heart size={18} /></Link>
            <button onClick={onCartOpen} className="relative p-2 text-ink-mute hover:text-teal" aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 bg-teal text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-black/5">
              <form onSubmit={handleSearch} className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex gap-3">
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bras, diapers, period care..." className="flex-1 bg-white rounded-full px-5 py-2.5 text-sm outline-none border border-black/10" autoFocus />
                <button type="submit" className="bg-teal text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-glow">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
            <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="w-[300px] h-full bg-[#F4FAFA] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <Logo href={undefined} compact />
                <button onClick={() => setMobileOpen(false)} aria-label="Close"><X size={22} /></button>
              </div>
              {NAV.map(item => (
                <div key={item.label} className="mb-4">
                  <Link href={item.href} className="font-semibold block py-2" onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  {item.children?.map(c => (
                    <Link key={c.label} href={c.href} className="block py-1.5 pl-4 text-sm text-ink-mute" onClick={() => setMobileOpen(false)}>{c.label}</Link>
                  ))}
                </div>
              ))}
              <div className="mt-8 pt-4 border-t space-y-3 text-sm">
                <Link href="/sell" onClick={() => setMobileOpen(false)}>Sell with us</Link>
                <Link href="/account" onClick={() => setMobileOpen(false)}>My Account</Link>
                <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>
                <Link href="/supplier" onClick={() => setMobileOpen(false)}>Supplier</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
