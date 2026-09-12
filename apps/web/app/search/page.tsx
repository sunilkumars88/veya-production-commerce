'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import CartDrawer from '../../components/CartDrawer';
import { api } from '../../lib/api';

function SearchResults() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState<any>({ items: [], total: 0 });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (q) api.search(q).then(setResults).catch(() => {});
  }, [q]);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="max-w-[1440px] mx-auto px-4 md:px-14 py-8 md:py-12">
        <h1 className="font-serif text-3xl">Search results</h1>
        <p className="text-black/50 mt-2">{results.total} results for &ldquo;{q}&rdquo;</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
          {results.items?.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {results.items?.length === 0 && q && <p className="text-center text-black/40 py-16">No products found. Try a different search term.</p>}
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-black/40">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
