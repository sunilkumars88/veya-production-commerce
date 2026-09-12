'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { addToCart } from '../lib/cart';

interface Props {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const variant = product.variants?.[0];
  const image = product.images?.[0]?.url;
  const discount = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    addToCart({
      variantId: variant.id, productId: product.id, title: product.title, slug: product.slug,
      price: variant.price || product.price, mrp: product.mrp, size: variant.size, color: variant.color,
      sku: variant.sku, qty: 1, image,
    });
  };

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#eadbd2] to-[#c9b2a6] relative overflow-hidden">
          {image && <img src={image} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
          {!image && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.8),transparent_30%)]" />}
          {product.newArrival && <span className="absolute top-4 left-4 bg-black text-white text-[10px] px-3 py-1 rounded-full tracking-wider uppercase">New</span>}
          {product.bestSeller && <span className="absolute top-4 left-4 bg-[#d76d6d] text-white text-[10px] px-3 py-1 rounded-full tracking-wider uppercase">Bestseller</span>}
          {discount > 0 && <span className="absolute top-4 right-4 bg-white/90 text-black text-[10px] px-3 py-1 rounded-full font-medium">{discount}% off</span>}
          <button onClick={handleQuickAdd} className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">Quick add</button>
        </div>
        <div className="pt-3 md:pt-4">
          <h3 className="font-medium text-sm md:text-base">{product.title}</h3>
          <p className="text-xs md:text-sm text-black/50 mt-1">{product.fabric || 'Thoughtful everyday fabric'}</p>
          <p className="mt-2 text-sm md:text-base">
            ₹{product.price.toLocaleString('en-IN')}
            {product.mrp > product.price && <del className="text-black/30 text-xs md:text-sm ml-2">₹{product.mrp.toLocaleString('en-IN')}</del>}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
