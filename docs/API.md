# VEYA API Reference

Base URL: `http://localhost:4000/api/v1`

## Response Format

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "requestId": "..." } }
```

## Products

| Method | Path | Description |
|--------|------|-------------|
| GET | /products | List products (filters: category, collection, sort, page, limit) |
| GET | /products/search?q= | Search products |
| GET | /products/search/suggest?q= | Search suggestions |
| GET | /products/:slug | Product detail with reviews and related |

## Catalog

| Method | Path | Description |
|--------|------|-------------|
| GET | /catalog/categories | Category tree |
| GET | /catalog/categories/:slug | Category detail |
| GET | /catalog/collections | List collections |
| GET | /catalog/collections/:slug | Collection with products |
| GET | /catalog/homepage | Homepage CMS data |
| GET | /catalog/pages/:slug | Content pages |

## Checkout

| Method | Path | Description |
|--------|------|-------------|
| POST | /checkout/create | Create order (body: items, address, couponCode, paymentMethod) |
| POST | /checkout/verify | Verify Razorpay payment |
| POST | /checkout/coupon | Validate coupon |
| GET | /checkout/pincode/:pincode | Check serviceability |

## Orders

| Method | Path | Description |
|--------|------|-------------|
| GET | /orders/:number | Order detail with timeline |
| POST | /orders/returns | Create return request |

## Size

| Method | Path | Description |
|--------|------|-------------|
| POST | /size/recommend | Size recommendation |

## Admin (requires x-admin-token header)

| Method | Path | Description |
|--------|------|-------------|
| GET | /admin/dashboard | KPIs and recent orders |
| GET | /admin/orders | Order list |
| POST | /admin/orders/:id/fulfill | Assign supplier |
| POST | /admin/orders/:id/ship | Create shipment |
| POST | /admin/orders/:id/status | Update status |
| GET | /admin/products | Product list |
| GET | /admin/customers | Customer list |
| GET/PUT | /admin/settings | App settings |

## Supplier

| Method | Path | Description |
|--------|------|-------------|
| GET | /supplier/orders | Fulfilment queue |
| POST | /supplier/orders/:id/accept | Accept order |
| POST | /supplier/orders/:id/packed | Mark packed |
| POST | /supplier/orders/:id/shipped | Mark shipped |

## Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | /webhooks/razorpay | Razorpay payment events |
| POST | /webhooks/shipping | Shipping status updates |

## Shopify (requires admin token)

| Method | Path | Description |
|--------|------|-------------|
| GET | /shopify/shop | Shop info |
| POST | /shopify/sync/products | Sync products |
| POST | /shopify/sync/orders | List orders |

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health |
| GET | /ready | Readiness (checks DB) |
