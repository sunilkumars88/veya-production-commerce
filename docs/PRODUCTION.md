# Production launch

## Shopify
Use the Admin GraphQL API with a versioned endpoint. The current stable API used by this code is 2026-07. Create a Shopify custom/public app as appropriate for your installation and grant the minimum scopes required for products, inventory, orders and fulfilment. Store the Admin token only on the server.

## Razorpay
Create Orders server-side. On checkout success send `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to the API. Verify the signature server-side. Configure webhooks with a secret and verify the raw request body. Do not fulfil based only on a browser callback.

## Dropshipping
Supplier flow:
PAID/CONFIRMED -> SUPPLIER_ASSIGNED -> PROCESSING -> PACKED -> SHIPPED -> DELIVERED.
Supplier must blind-ship under the Veya/private-label agreement. Maintain SKU, cost, stock and SLA per supplier.

## Shipping
Replace `MockShippingProvider` with the commercial provider adapter after account approval. The interface isolates courier changes from the order service.

## Security
- HTTPS only
- production secret manager
- admin MFA/SSO
- DB backups and PITR
- WAF/rate limits
- audit logging
- webhook idempotency
- CSP/security headers
- PII minimisation
- payment keys never in browser except public key
- never log payment secrets

## Legal/operations
Configure GST/tax invoices, privacy policy, terms, shipping policy, return/exchange policy, hygiene restrictions, customer support process, supplier QA and COD/RTO rules.
