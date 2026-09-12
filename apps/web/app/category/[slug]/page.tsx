'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import CartDrawer from '../../../components/CartDrawer';
import { api } from '../../../lib/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any>({ items: [], total: 0 });
  const [category, setCategory] = useState<any>(null);
  const [sort, setSort] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getCategory(slug as string).then(setCategory).catch(() => {});
    api.getProducts({ category: slug as string, sort, limit: '24' }).then(setProducts).catch(() => {});
  }, [slug, sort]);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="max-w-[1440px] mx-auto px-4 md:px-14 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <p className="text-sm text-black/50">Category</p>
          <h1 className="font-serif text-3xl md:text-5xl mt-2">{category?.name || slug}</h1>
          {category?.description && <p className="text-black/50 mt-3 max-w-xl">{category.description}</p>}
        </div>
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-black/40">{products.total} pieces</span>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border border-black/20 rounded-full px-4 py-2 text-sm outline-none bg-white">
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popular</option>
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-12">
          {products.items?.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {products.items?.length === 0 && <p className="text-center text-black/40 py-16">No products found in this category.</p>}
      </main>
      <Footer />
    </>
  );
}
