'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import CartDrawer from '../../../components/CartDrawer';
import { api } from '../../../lib/api';

export default function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getCollection(slug as string).then(setCollection).catch(() => {});
  }, [slug]);

  const products = collection?.products?.map((pc: any) => pc.product) || [];

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="max-w-[1440px] mx-auto px-4 md:px-14 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-5xl">{collection?.name || slug}</h1>
        {collection?.description && <p className="text-black/50 mt-3">{collection.description}</p>}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-12 mt-8 md:mt-12">
          {products.map((p: any, i: number) => p && <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {products.length === 0 && <p className="text-center text-black/40 py-16">No products in this collection yet.</p>}
      </main>
      <Footer />
    </>
  );
}
