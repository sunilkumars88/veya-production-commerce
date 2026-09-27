# SakhiKart — India’s essentials marketplace

Flipkart-style ecommerce for innerwear, period care, hygiene, baby, maternity and wellness.

Original catalogue. Not affiliated with competitor brands. Clearwave-inspired mint/teal theme.

## Demo
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin
- Supplier: http://localhost:3000/supplier
- Sell: http://localhost:3000/sell
- API: http://localhost:4000/health

Coupon: `SAKHI10`

## Run
```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Launch payments
Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
Webhook: `POST /api/v1/webhooks/razorpay`

## Dropshipping
Paid order → assign supplier (admin) → supplier accept/pack/ship.
Blind shipping is on by default.

## Vendors
Architecture is marketplace-ready (`Supplier`, scoring, portal). Public vendor listing opens after KYC via `/sell`.
