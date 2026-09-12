# VEYA — Production D2C Commerce Platform

A premium India-first D2C ecommerce platform for private-label/dropshipping operations.

## Architecture

```
apps/
  web/          Next.js storefront + admin + supplier UI
  api/          Express REST API (v1)
packages/
  db/           Prisma schema + seed
  types/        Shared TypeScript types
  validation/   Zod schemas
  config/       Environment configuration
  integrations/ Provider abstractions (payment, shipping, supplier, notifications, search, shopify)
```

## Features

### Storefront
- Premium animated homepage with CMS-driven sections
- Product catalogue (32 products), search, category/collection filtering
- Product pages with size assistant, pincode checker, reviews
- Persistent cart with free shipping progress
- Multi-step checkout (Razorpay + COD)
- Order tracking with status timeline
- Account pages, content pages, SEO (sitemap, robots, metadata)

### Backend
- REST API v1 with consistent error responses
- Pricing engine (server-side recalculation, coupon validation)
- Inventory reservations with expiry
- Supplier scoring and selection engine
- Size recommendation engine
- Order lifecycle with status history audit
- Webhook processing (Razorpay, shipping) with idempotency
- RBAC-ready user model, audit logs, feature flags
- Settings system (configurable business rules)

### Integrations
- Razorpay (order creation, signature verification, webhooks, refunds)
- Shopify Admin GraphQL (product/order sync)
- Shipping provider abstraction (mock + generic REST)
- Supplier provider abstraction (mock + generic REST)
- Notification provider abstraction (email, SMS, WhatsApp ready)
- Search provider abstraction (Prisma-based, migration-ready)

### Admin & Supplier
- Operations dashboard with KPIs
- Order management (fulfil, ship, status updates)
- Supplier fulfilment portal (accept → pack → ship)

## Quick Start

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| Supplier | http://localhost:3000/supplier |
| API | http://localhost:4000 |
| API Health | http://localhost:4000/health |

## Commands

```bash
npm run dev          # Start web + api
npm run build        # Build all
npm run typecheck    # TypeScript check
npm test             # Unit tests
npm run db:seed      # Seed database
```

## Environment

See `.env.example` for all configuration. Key variables:

- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Payment processing
- `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_ADMIN_ACCESS_TOKEN` — Shopify sync
- `ADMIN_TOKEN` — Admin API authentication
- `SHIPPING_PROVIDER` — `mock` or `generic`
- `SUPPLIER_MODE` — `mock` or `generic`

## API

All endpoints under `/api/v1/`. See `docs/API.md`.

## Production

See `docs/PRODUCTION.md` for deployment instructions.
