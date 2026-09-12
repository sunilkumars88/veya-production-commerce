import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().regex(/^[0-9]{6}$/),
  country: z.string().default('IN'),
});

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
  billingAddress: addressSchema.optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
  idempotencyKey: z.string().optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export const returnRequestSchema = z.object({
  orderNumber: z.string(),
  reason: z.string().min(3).max(500),
  itemIds: z.array(z.string()).min(1),
  pickupAddress: addressSchema.optional(),
  exchangeVariantId: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(2000),
});

export const otpRequestSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
  email: z.string().email().optional(),
  purpose: z.enum(['login', 'verify', 'cod']).default('login'),
}).refine(d => d.phone || d.email, { message: 'Phone or email required' });

export const otpVerifySchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  code: z.string().length(6),
  purpose: z.string().default('login'),
});

export const sizeRecommendationSchema = z.object({
  age: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  waist: z.number().optional(),
  hip: z.number().optional(),
  bust: z.number().optional(),
  underbust: z.number().optional(),
  existingBraSize: z.string().optional(),
  preferredFit: z.enum(['snug', 'regular', 'relaxed']).optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  fabric: z.string().optional(),
  rating: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'popular']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export const pincodeCheckSchema = z.object({
  pincode: z.string().regex(/^[0-9]{6}$/),
  amount: z.number().optional(),
});

export const couponApplySchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export const adminStatusUpdateSchema = z.object({
  status: z.string(),
  reason: z.string().optional(),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(['Order', 'Payment', 'Shipping', 'Return', 'Exchange', 'Product', 'Other']).default('Other'),
  orderId: z.string().optional(),
});
