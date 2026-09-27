'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { addToCart } from '../lib/cart';

export default function ProductCard({ product, index = 0 }: { product: any; index?: number }) {
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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#DFF0EE] to-[#B7D9D4] relative overflow-hidden shadow-sm">
          {image && <img src={image} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
          {product.newArrival && <span className="absolute top-3 left-3 bg-teal text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wide">New</span>}
          {product.bestSeller && !product.newArrival && <span className="absolute top-3 left-3 bg-[#0D1E1C] text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wide">Bestseller</span>}
          {discount > 0 && <span className="absolute top-3 right-3 bg-white/95 text-teal text-[10px] px-3 py-1 rounded-full font-semibold">{discount}% off</span>}
          <button onClick={handleQuickAdd} className="absolute bottom-3 left-3 right-3 bg-teal text-white py-2.5 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 shadow-glow">Add to cart</button>
        </div>
        <div className="pt-3">
          <h3 className="font-medium text-sm md:text-[15px] leading-snug">{product.title}</h3>
          <p className="text-xs text-ink-mute mt-1">{product.fabric || product.shortDescription}</p>
          <p className="mt-2 text-sm font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
            {product.mrp > product.price && <del className="text-ink-mute/50 text-xs font-normal ml-2">₹{product.mrp.toLocaleString('en-IN')}</del>}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
