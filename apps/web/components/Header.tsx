'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, cartCount } from '../lib/cart';

const NAV = [
  { label: 'Women', href: '/category/womens-innerwear', children: [
    { label: 'Bras', href: '/category/bras' },
    { label: 'Panties', href: '/category/panties' },
    { label: 'Period', href: '/category/period' },
    { label: 'Activewear', href: '/category/activewear' },
    { label: 'Comfortwear', href: '/category/comfortwear' },
    { label: 'Nightwear', href: '/category/nightwear' },
  ]},
  { label: 'Girls', href: '/category/girls', children: [
    { label: 'Training Bras', href: '/category/training-bras' },
    { label: 'Briefs', href: '/category/girls-briefs' },
    { label: 'Camisoles', href: '/category/camisoles' },
    { label: 'Inner Shorts', href: '/category/inner-shorts' },
    { label: 'Period', href: '/category/period' },
  ]},
  { label: 'Collections', href: '/collections/best-sellers', children: [
    { label: 'Everyday', href: '/collections/everyday' },
    { label: 'Active', href: '/collections/active' },
    { label: 'Period', href: '/collections/period-collection' },
    { label: 'Best Sellers', href: '/collections/best-sellers' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
  ]},
  { label: 'Sale', href: '/collections/sale' },
];

export default function Header({ onCartOpen, onSearch }: { onCartOpen?: () => void; onSearch?: (q: string) => void }) {
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('cart-updated', update); window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <>
      <div className="bg-black text-white text-center py-2 text-[10px] tracking-[.24em]">
        FREE SHIPPING ABOVE ₹999 · COD AVAILABLE · PRIVATE LABEL QUALITY
      </div>
      <header className={`sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-md' : ''} bg-[#f8f4ee]/95 backdrop-blur border-b border-black/10`}>
        <div className="h-16 md:h-20 px-4 md:px-12 flex items-center justify-between max-w-[1440px] mx-auto">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu"><Menu size={22} /></button>
          <Link href="/" className="font-serif text-2xl md:text-3xl">veya<span className="text-[#d76d6d]">.</span></Link>

          <nav className="hidden lg:flex gap-8 text-sm">
            {NAV.map(item => (
              <div key={item.label} className="relative group" onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
                <Link href={item.href} className="flex items-center gap-1 py-2 hover:text-[#d76d6d] transition-colors">
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                {item.children && activeMenu === item.label && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 bg-white rounded-2xl shadow-xl p-6 min-w-[200px] border border-black/5">
                    {item.children.map(c => (
                      <Link key={c.label} href={c.href} className="block py-2 text-sm hover:text-[#d76d6d] transition-colors">{c.label}</Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2" aria-label="Search"><Search size={18} /></button>
            <Link href="/account/wishlist" className="hidden md:block p-2" aria-label="Wishlist"><Heart size={18} /></Link>
            <button onClick={onCartOpen} className="relative p-2" aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -right-1 -top-1 bg-black text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-black/10 overflow-hidden">
              <form onSubmit={handleSearch} className="max-w-[1440px] mx-auto px-4 md:px-12 py-3 flex gap-3">
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search essentials..." className="flex-1 bg-white rounded-full px-5 py-2.5 text-sm outline-none border border-black/10" autoFocus />
                <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-full text-sm">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
            <motion.nav initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="w-[300px] h-full bg-[#f8f4ee] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-2xl">veya.</span>
                <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
              </div>
              {NAV.map(item => (
                <div key={item.label} className="mb-4">
                  <Link href={item.href} className="font-medium text-lg block py-2" onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  {item.children?.map(c => (
                    <Link key={c.label} href={c.href} className="block py-1.5 pl-4 text-sm text-black/60" onClick={() => setMobileOpen(false)}>{c.label}</Link>
                  ))}
                </div>
              ))}
              <div className="mt-8 pt-4 border-t border-black/10 space-y-3 text-sm">
                <Link href="/account" onClick={() => setMobileOpen(false)}>My Account</Link>
                <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
