'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Truck, ShieldCheck, RotateCcw, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import CartDrawer from '../../../components/CartDrawer';
import { api } from '../../../lib/api';
import { addToCart } from '../../../lib/cart';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState<any>(null);
  const [sizeRec, setSizeRec] = useState<any>(null);
  const [showSizeAssistant, setShowSizeAssistant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getProduct(slug as string).then(p => {
      setProduct(p);
      const sizes = [...new Set(p.variants.map((v: any) => v.size))] as string[];
      const colors = [...new Set(p.variants.map((v: any) => v.color))] as string[];
      setSelectedSize(sizes[0] || '');
      setSelectedColor(colors[0] || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product || !selectedSize || !selectedColor) return;
    const v = product.variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);
    setSelectedVariant(v);
  }, [product, selectedSize, selectedColor]);

  const sizes: string[] = product ? [...new Set(product.variants.map((v: any) => v.size))] as string[] : [];
  const colors: string[] = product ? [...new Set(product.variants.map((v: any) => v.color))] as string[] : [];
  const price = selectedVariant?.price || product?.price || 0;
  const mrp = selectedVariant?.compareAtPrice || product?.mrp || 0;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  const avgRating = product?.reviews?.length ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    addToCart({
      variantId: selectedVariant.id, productId: product.id, title: product.title, slug: product.slug,
      price, mrp, size: selectedVariant.size, color: selectedVariant.color, sku: selectedVariant.sku,
      qty, image: product.images?.[0]?.url,
    });
    setCartOpen(true);
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) return;
    const result = await api.checkPincode(pincode, price * qty);
    setDelivery(result);
  };

  const getSizeRecommendation = async () => {
    const result = await api.recommendSize({ preferredFit: 'regular', productId: product?.id });
    setSizeRec(result);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-black/40">Loading...</div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p>Product not found</p></div>;

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-[1440px] mx-auto px-4 md:px-14 py-8 md:py-12">
        <nav className="text-sm text-black/50 mb-6">
          <Link href="/">Home</Link> / <Link href={`/category/${product.category?.slug}`}>{product.category?.name}</Link> / <span className="text-black">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-[#eadbd2] to-[#c9b2a6] overflow-hidden relative">
              {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img: any) => (
                  <div key={img.id} className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#eadbd2] to-[#c9b2a6]">
                    <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl">{product.title}</h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="text-[#d76d6d]">{'★'.repeat(Math.round(avgRating))}</span>
                <span className="text-black/50">({product.reviews.length} reviews)</span>
              </div>
            )}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-medium">₹{price.toLocaleString('en-IN')}</span>
              {mrp > price && <del className="text-black/30">₹{mrp.toLocaleString('en-IN')}</del>}
              {discount > 0 && <span className="text-[#d76d6d] text-sm font-medium">{discount}% off</span>}
            </div>
            <p className="text-xs text-black/40 mt-1">Inclusive of all taxes</p>
            <p className="text-sm text-black/60 mt-4">{product.shortDescription || product.description?.substring(0, 150)}</p>

            {/* Color */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Color: {selectedColor}</p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-full text-sm border ${selectedColor === c ? 'border-black bg-black text-white' : 'border-black/20'}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Size: {selectedSize}</p>
                <button onClick={() => { setShowSizeAssistant(!showSizeAssistant); if (!sizeRec) getSizeRecommendation(); }} className="text-xs text-[#d76d6d] underline">Find my size</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`w-12 h-12 rounded-full text-sm border flex items-center justify-center ${selectedSize === s ? 'border-black bg-black text-white' : 'border-black/20'}`}>{s}</button>
                ))}
              </div>
              {showSizeAssistant && sizeRec && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-4 bg-white rounded-xl border border-black/10 text-sm">
                  <p className="font-medium">Recommended: {sizeRec.recommendedSize}</p>
                  <p className="text-black/60 mt-1">Confidence: {sizeRec.confidence}%</p>
                  <p className="text-black/50 mt-1">{sizeRec.reason}</p>
                  {sizeRec.alternativeSize && <p className="mt-2 text-black/50">Alternative: {sizeRec.alternativeSize}</p>}
                </motion.div>
              )}
            </div>

            {/* Qty */}
            <div className="mt-6 flex items-center gap-4">
              <p className="text-sm font-medium">Qty:</p>
              <div className="flex items-center gap-3 border border-black/20 rounded-full px-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center">−</button>
                <span className="w-6 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-4 rounded-full text-sm font-medium">Add to bag</button>
              <Link href="/checkout" onClick={handleAddToCart} className="flex-1 border border-black py-4 rounded-full text-sm font-medium text-center">Buy now</Link>
            </div>

            {/* Pincode */}
            <div className="mt-6 p-4 bg-white rounded-xl">
              <p className="text-sm font-medium mb-2">Check delivery</p>
              <div className="flex gap-2">
                <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter pincode" className="flex-1 border border-black/20 rounded-full px-4 py-2 text-sm outline-none" />
                <button onClick={checkPincode} className="bg-black text-white px-5 py-2 rounded-full text-sm">Check</button>
              </div>
              {delivery && (
                <p className="text-sm mt-2 text-black/60">
                  {delivery.serviceable ? `Delivery in ${delivery.etaDays} days · ${delivery.shippingCost === 0 ? 'Free shipping' : `₹${delivery.shippingCost} shipping`}` : 'Not serviceable'}
                  {delivery.codAvailable && ' · COD available'}
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-black/50">
              <div className="p-3 bg-white rounded-xl"><Truck size={16} className="mx-auto mb-1" />Fast delivery</div>
              <div className="p-3 bg-white rounded-xl"><ShieldCheck size={16} className="mx-auto mb-1" />Secure pay</div>
              <div className="p-3 bg-white rounded-xl"><RotateCcw size={16} className="mx-auto mb-1" />Easy returns</div>
            </div>

            {/* Description */}
            <div className="mt-8 space-y-4 text-sm text-black/60 leading-relaxed">
              <p>{product.description}</p>
              {product.benefits?.length > 0 && (
                <div><p className="font-medium text-black mb-2">Benefits</p><ul className="list-disc pl-5 space-y-1">{product.benefits.map((b: string) => <li key={b}>{b}</li>)}</ul></div>
              )}
              {product.careInstructions && <div><p className="font-medium text-black mb-1">Care</p><p>{product.careInstructions}</p></div>}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="font-serif text-3xl mb-6">Reviews</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.reviews.map((r: any) => (
                <div key={r.id} className="bg-white rounded-2xl p-5">
                  <div className="flex gap-1 mb-2">{Array.from({ length: r.rating }).map((_, i) => <span key={i} className="text-[#d76d6d] text-sm">★</span>)}</div>
                  {r.title && <p className="font-medium text-sm">{r.title}</p>}
                  <p className="text-sm text-black/60 mt-1">{r.body}</p>
                  <p className="text-xs text-black/40 mt-3">{r.user?.name || 'Customer'}{r.verifiedPurchase && ' · Verified purchase'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {product.related?.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="font-serif text-3xl mb-8">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {product.related.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
