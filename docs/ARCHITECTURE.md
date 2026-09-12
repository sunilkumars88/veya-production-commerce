# Architecture

## Overview

```
Customer → Next.js Storefront (apps/web)
              ↓
         Express API (apps/api) → /api/v1/*
              ↓
    ┌─────────┼─────────┬──────────┬──────────┐
    ↓         ↓         ↓          ↓          ↓
 PostgreSQL  Redis    Razorpay   Shopify   Shipping
 (Prisma)   (ready)              GraphQL   Supplier
                                              ↓
                                         Notifications
```

## Layered Architecture

```
Routes (controllers)     → HTTP handling, validation
Services                 → Business logic
Repositories (Prisma)    → Data access
Integrations (providers) → External service adapters
```

## Provider Abstractions

| Provider | Interface | Implementations |
|----------|-----------|-----------------|
| Payment | PaymentProvider | RazorpayPaymentProvider, MockPaymentProvider |
| Shipping | ShippingProvider | MockShippingProvider, GenericShippingProvider |
| Supplier | SupplierProvider | MockSupplierProvider, GenericSupplierProvider |
| Notification | NotificationProvider | MockNotificationProvider, EmailNotificationProvider |
| Storage | StorageProvider | LocalStorageProvider |
| Search | SearchProvider | PrismaSearchProvider (→ OpenSearch/Algolia ready) |

## Order Lifecycle

```
PENDING_PAYMENT → PAID → CONFIRMED → SUPPLIER_ASSIGNED → PROCESSING
→ PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                                    ↓
                              RETURN_REQUESTED → RETURNED → REFUNDED
```

Every transition is recorded in OrderStatusHistory with actor, reason, and metadata.

## Inventory

```
available = stock - reserved
```

Reservations expire after configurable TTL. Stale reservations auto-release via background job.

## Supplier Selection

Weighted scoring across: cost, inventory, delivery SLA, quality, return rate, RTO rate.

## Multi-tenant Ready

Models use organization-agnostic IDs. Feature flags and settings support per-environment configuration.

## Scaling Path

1. Move webhook/notification processing to BullMQ workers
2. Add Redis caching for catalogue and serviceability
3. Migrate search to OpenSearch/Meilisearch
4. Split admin/supplier into separate apps
5. Add CDN for product images via S3/R2 StorageProvider
