export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  mrp: number;
  size: string;
  color: string;
  sku: string;
  qty: number;
  image?: string;
}

const CART_KEY = 'sakhikart_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find(c => c.variantId === item.variantId);
  if (existing) existing.qty += item.qty;
  else cart.push(item);
  saveCart(cart);
  return cart;
}

export function updateQty(variantId: string, qty: number) {
  const cart = getCart().map(c => c.variantId === variantId ? { ...c, qty: Math.max(0, qty) } : c).filter(c => c.qty > 0);
  saveCart(cart);
  return cart;
}

export function removeFromCart(variantId: string) {
  const cart = getCart().filter(c => c.variantId !== variantId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}
