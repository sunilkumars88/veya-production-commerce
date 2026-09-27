import Link from 'next/link';
import Logo, { BRAND } from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0D1E1C] text-white px-4 md:px-10 py-16 mt-8">
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <Logo inverted showTagline />
          <p className="text-white/55 text-sm leading-relaxed mt-4">Innerwear, period care, hygiene, baby and wellness. Dropship today. Vendors tomorrow.</p>
        </div>
        <div>
          <p className="text-xs tracking-[.18em] uppercase text-white/40 mb-4">Shop</p>
          <div className="space-y-2 text-sm text-white/70">
            <Link href="/category/bras" className="block hover:text-white">Innerwear</Link>
            <Link href="/category/period-wear" className="block hover:text-white">Period</Link>
            <Link href="/category/cloth-diapers" className="block hover:text-white">Baby</Link>
            <Link href="/category/wellness" className="block hover:text-white">Wellness</Link>
            <Link href="/collections/best-sellers" className="block hover:text-white">Best Sellers</Link>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[.18em] uppercase text-white/40 mb-4">Help</p>
          <div className="space-y-2 text-sm text-white/70">
            <Link href="/pages/contact" className="block hover:text-white">Contact</Link>
            <Link href="/pages/shipping-policy" className="block hover:text-white">Shipping</Link>
            <Link href="/pages/return-policy" className="block hover:text-white">Returns</Link>
            <Link href="/pages/privacy-policy" className="block hover:text-white">Privacy</Link>
            <Link href="/sell" className="block hover:text-white">Sell with us</Link>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[.18em] uppercase text-white/40 mb-4">Pay & ship</p>
          <p className="text-sm text-white/55">Razorpay · UPI · Cards · COD<br />Pan-India dropship fulfilment</p>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between text-xs text-white/40 gap-2">
        <span>© 2026 {BRAND.name}. Original catalogue.</span>
        <span>Made in India</span>
      </div>
    </footer>
  );
}
