'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const LINKS = [
  { href: '/account/orders', label: 'My Orders', desc: 'Track and manage orders' },
  { href: '/account/wishlist', label: 'Wishlist', desc: 'Saved items' },
  { href: '/account/addresses', label: 'Addresses', desc: 'Manage delivery addresses' },
  { href: '/account/rewards', label: 'Rewards', desc: 'Loyalty points and referrals' },
  { href: '/account/settings', label: 'Settings', desc: 'Account preferences' },
];

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="max-w-[600px] mx-auto px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl">My account</h1>
        <p className="text-black/50 mt-2 text-sm">Sign in with OTP to access your account. Passwordless authentication supported.</p>
        <div className="mt-8 space-y-3">
          {LINKS.map(link => (
            <Link key={link.href} href={link.href} className="block bg-white rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <p className="font-medium">{link.label}</p>
              <p className="text-sm text-black/50 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
