export interface ApiError {
  success: false;
  error: { code: string; message: string; requestId?: string };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CartItemInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutInput {
  items: CartItemInput[];
  address: AddressInput;
  billingAddress?: AddressInput;
  couponCode?: string;
  paymentMethod?: 'razorpay' | 'cod';
  idempotencyKey?: string;
}

export interface AddressInput {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface SizeRecommendationInput {
  age?: number;
  height?: number;
  weight?: number;
  waist?: number;
  hip?: number;
  bust?: number;
  underbust?: number;
  existingBraSize?: string;
  preferredFit?: 'snug' | 'regular' | 'relaxed';
  productId?: string;
  categoryId?: string;
}

export interface SizeRecommendation {
  recommendedSize: string;
  confidence: number;
  alternativeSize?: string;
  reason: string;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  rating?: number;
  inStock?: boolean;
  sort?: string;
}

export interface ShippingQuote {
  cost: number;
  etaDays: number;
  codAvailable: boolean;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface SupplierScore {
  supplierId: string;
  supplierName: string;
  score: number;
  factors: Record<string, number>;
}

export const ORDER_STATUSES = [
  'PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'SUPPLIER_ASSIGNED', 'PROCESSING',
  'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
  'RTO', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED',
] as const;

export const ERROR_CODES = {
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  VARIANT_OUT_OF_STOCK: 'VARIANT_OUT_OF_STOCK',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INVALID_PAYMENT_SIGNATURE: 'INVALID_PAYMENT_SIGNATURE',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  RETURN_NOT_ELIGIBLE: 'RETURN_NOT_ELIGIBLE',
  COUPON_INVALID: 'COUPON_INVALID',
  SUPPLIER_UNAVAILABLE: 'SUPPLIER_UNAVAILABLE',
  SHIPPING_UNAVAILABLE: 'SHIPPING_UNAVAILABLE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;
