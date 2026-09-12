export function getEnv(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (!val && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required env: ${key}`);
  }
  return val ?? '';
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiPort: Number(process.env.API_PORT || 4000),
  databaseUrl: getEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/veya'),
  redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),
  adminToken: getEnv('ADMIN_TOKEN', 'dev-admin-token'),
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  },
  shopify: {
    domain: process.env.SHOPIFY_STORE_DOMAIN || '',
    token: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
    version: process.env.SHOPIFY_API_VERSION || '2026-07',
    enabled: !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN),
  },
  shipping: {
    provider: process.env.SHIPPING_PROVIDER || 'mock',
    apiUrl: process.env.SHIPPING_API_URL || '',
    apiKey: process.env.SHIPPING_API_KEY || '',
  },
  supplier: {
    mode: process.env.SUPPLIER_MODE || 'mock',
    apiUrl: process.env.SUPPLIER_API_URL || '',
    apiKey: process.env.SUPPLIER_API_KEY || '',
  },
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    token: process.env.WHATSAPP_ACCESS_TOKEN || '',
  },
  email: {
    from: process.env.EMAIL_FROM || 'orders@veya.demo',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  reservation: {
    ttlMinutes: Number(process.env.RESERVATION_TTL_MINUTES || 30),
  },
};

export function validateProductionConfig() {
  if (!config.isProduction) return;
  const required = ['DATABASE_URL', 'ADMIN_TOKEN'];
  if (config.razorpay.enabled) required.push('RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET');
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Production requires ${key}`);
  }
  if (config.adminToken === 'dev-admin-token' || config.adminToken === 'change-this-in-production') {
    throw new Error('ADMIN_TOKEN must be changed in production');
  }
}
