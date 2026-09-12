import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-14 py-16">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <p className="font-serif text-3xl mb-4">veya<span className="text-[#d76d6d]">.</span></p>
          <p className="text-white/50 text-sm leading-relaxed">Premium comfort essentials designed for repeat everyday wear. Comfort. Confidence. Quality.</p>
        </div>
        <div>
          <p className="text-xs tracking-[.2em] uppercase text-white/40 mb-4">Shop</p>
          <div className="space-y-2 text-sm text-white/70">
            <Link href="/category/bras" className="block hover:text-white">Bras</Link>
            <Link href="/category/panties" className="block hover:text-white">Panties</Link>
            <Link href="/category/period" className="block hover:text-white">Period</Link>
            <Link href="/collections/best-sellers" className="block hover:text-white">Best Sellers</Link>
            <Link href="/collections/new-arrivals" className="block hover:text-white">New Arrivals</Link>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[.2em] uppercase text-white/40 mb-4">Help</p>
          <div className="space-y-2 text-sm text-white/70">
            <Link href="/pages/contact" className="block hover:text-white">Contact</Link>
            <Link href="/pages/shipping-policy" className="block hover:text-white">Shipping</Link>
            <Link href="/pages/return-policy" className="block hover:text-white">Returns</Link>
            <Link href="/pages/privacy-policy" className="block hover:text-white">Privacy</Link>
            <Link href="/pages/terms" className="block hover:text-white">Terms</Link>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[.2em] uppercase text-white/40 mb-4">Newsletter</p>
          <p className="text-sm text-white/50 mb-4">Get updates on new arrivals and offers.</p>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); alert('Newsletter signup — configure provider in production.'); }}>
            <input type="email" placeholder="Your email" className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-sm outline-none border border-white/20" required />
            <button type="submit" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium">Join</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between text-xs text-white/40">
        <span>© 2026 Veya. All rights reserved.</span>
        <span>Made with care in India</span>
      </div>
    </footer>
  );
}
