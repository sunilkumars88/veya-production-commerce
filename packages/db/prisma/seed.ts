import { PrismaClient, Gender, AgeGroup } from '@prisma/client';

const db = new PrismaClient();

const PRODUCTS = [
  { title: 'CloudSoft Everyday Brief', slug: 'cloudsoft-everyday-brief', fabric: 'Cotton modal blend', price: 399, mrp: 599, category: 'panties', gender: 'WOMEN' as Gender, bestSeller: true },
  { title: 'MoveFlex Active Bra', slug: 'moveflex-active-bra', fabric: 'Nylon elastane', price: 899, mrp: 1299, category: 'bras', gender: 'WOMEN' as Gender, featured: true },
  { title: 'FlowCare Period Brief', slug: 'flowcare-period-brief', fabric: 'Cotton absorbent layers', price: 799, mrp: 1099, category: 'period', gender: 'WOMEN' as Gender, newArrival: true },
  { title: 'LoungeEase Camisole', slug: 'loungeease-camisole', fabric: 'Bamboo blend', price: 499, mrp: 699, category: 'comfortwear', gender: 'WOMEN' as Gender },
  { title: 'SecondSkin Boyshort', slug: 'secondskin-boyshort', fabric: 'Micro-modal stretch', price: 449, mrp: 699, category: 'panties', gender: 'WOMEN' as Gender },
  { title: 'DailyForm Comfort Bra', slug: 'dailyform-comfort-bra', fabric: 'Soft stretch microfiber', price: 999, mrp: 1499, category: 'bras', gender: 'WOMEN' as Gender, bestSeller: true },
  { title: 'SilkTouch Lace Bralette', slug: 'silktouch-lace-bralette', fabric: 'Silk blend lace', price: 1199, mrp: 1699, category: 'bras', gender: 'WOMEN' as Gender, featured: true },
  { title: 'PureCotton Hipster', slug: 'purecotton-hipster', fabric: '100% organic cotton', price: 349, mrp: 499, category: 'panties', gender: 'WOMEN' as Gender },
  { title: 'FlexFit Sports Bra', slug: 'flexfit-sports-bra', fabric: 'Performance nylon', price: 1099, mrp: 1599, category: 'activewear', gender: 'WOMEN' as Gender, newArrival: true },
  { title: 'NightBloom Sleep Set', slug: 'nightbloom-sleep-set', fabric: 'Modal satin', price: 1499, mrp: 2199, category: 'nightwear', gender: 'WOMEN' as Gender },
  { title: 'Seamless Sculpt Brief', slug: 'seamless-sculpt-brief', fabric: 'Seamless microfiber', price: 549, mrp: 799, category: 'panties', gender: 'WOMEN' as Gender },
  { title: 'AirFlow Mesh Bra', slug: 'airflow-mesh-bra', fabric: 'Breathable mesh', price: 799, mrp: 1199, category: 'bras', gender: 'WOMEN' as Gender },
  { title: 'PeriodGuard Maxi Brief', slug: 'periodguard-maxi-brief', fabric: 'Multi-layer absorbent', price: 899, mrp: 1299, category: 'period', gender: 'WOMEN' as Gender, bestSeller: true },
  { title: 'YogaFlex Legging Brief', slug: 'yogaflex-legging-brief', fabric: '4-way stretch', price: 599, mrp: 899, category: 'activewear', gender: 'WOMEN' as Gender },
  { title: 'CloudRest Night Bra', slug: 'cloudrest-night-bra', fabric: 'Soft cotton jersey', price: 649, mrp: 949, category: 'nightwear', gender: 'WOMEN' as Gender },
  { title: 'FirstStep Training Bra', slug: 'firststep-training-bra', fabric: 'Cotton blend', price: 299, mrp: 449, category: 'training-bras', gender: 'GIRLS' as Gender, ageGroup: 'TEEN' as AgeGroup },
  { title: 'GrowEasy Girls Brief', slug: 'groweasy-girls-brief', fabric: 'Soft cotton', price: 249, mrp: 349, category: 'girls-briefs', gender: 'GIRLS' as Gender, ageGroup: 'TEEN' as AgeGroup },
  { title: 'TeenFlex Camisole', slug: 'teenflex-camisole', fabric: 'Cotton modal', price: 349, mrp: 499, category: 'camisoles', gender: 'GIRLS' as Gender, ageGroup: 'TEEN' as AgeGroup },
  { title: 'ActiveGirl Inner Shorts', slug: 'activegirl-inner-shorts', fabric: 'Stretch cotton', price: 399, mrp: 549, category: 'inner-shorts', gender: 'GIRLS' as Gender, ageGroup: 'TEEN' as AgeGroup },
  { title: 'TeenPeriod Starter Brief', slug: 'teenperiod-starter-brief', fabric: 'Absorbent cotton', price: 449, mrp: 649, category: 'period', gender: 'GIRLS' as Gender, ageGroup: 'TEEN' as AgeGroup, newArrival: true },
  { title: 'Everyday Essential Brief 3-Pack', slug: 'everyday-essential-brief-3pack', fabric: 'Cotton modal', price: 999, mrp: 1497, category: 'panties', gender: 'WOMEN' as Gender, bestSeller: true },
  { title: 'Comfort Core Bra 2-Pack', slug: 'comfort-core-bra-2pack', fabric: 'Microfiber blend', price: 1599, mrp: 2398, category: 'bras', gender: 'WOMEN' as Gender },
  { title: 'Period Care Starter Kit', slug: 'period-care-starter-kit', fabric: 'Mixed fabrics', price: 1999, mrp: 2899, category: 'period', gender: 'WOMEN' as Gender, featured: true },
  { title: 'Active Essentials Set', slug: 'active-essentials-set', fabric: 'Performance blend', price: 2299, mrp: 3299, category: 'activewear', gender: 'WOMEN' as Gender },
  { title: 'Luxe Lace Collection Brief', slug: 'luxe-lace-collection-brief', fabric: 'French lace', price: 699, mrp: 999, category: 'panties', gender: 'WOMEN' as Gender },
  { title: 'WireFree Support Bra', slug: 'wirefree-support-bra', fabric: 'Cotton spandex', price: 849, mrp: 1199, category: 'bras', gender: 'WOMEN' as Gender },
  { title: 'Thermal Comfort Brief', slug: 'thermal-comfort-brief', fabric: 'Thermal cotton', price: 499, mrp: 749, category: 'comfortwear', gender: 'WOMEN' as Gender },
  { title: 'Maternity Support Bra', slug: 'maternity-support-bra', fabric: 'Stretch cotton', price: 949, mrp: 1399, category: 'bras', gender: 'WOMEN' as Gender },
  { title: 'HighWaist Sculpt Brief', slug: 'highwaist-sculpt-brief', fabric: 'Power mesh', price: 649, mrp: 949, category: 'panties', gender: 'WOMEN' as Gender },
  { title: 'BreezeCool Active Top', slug: 'breezecool-active-top', fabric: 'Cooling fabric', price: 799, mrp: 1149, category: 'activewear', gender: 'WOMEN' as Gender, newArrival: true },
  { title: 'DreamWeave Nightgown', slug: 'dreamweave-nightgown', fabric: 'Silk modal', price: 1299, mrp: 1899, category: 'nightwear', gender: 'WOMEN' as Gender },
  { title: 'CottonCloud Tank Bra', slug: 'cottoncloud-tank-bra', fabric: 'Pima cotton', price: 549, mrp: 799, category: 'bras', gender: 'WOMEN' as Gender },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['Black', 'Nude', 'White', 'Rose', 'Navy'];

const CATEGORIES = [
  { name: "Women's Innerwear", slug: 'womens-innerwear', children: [
    { name: 'Bras', slug: 'bras' },
    { name: 'Panties', slug: 'panties' },
    { name: 'Period', slug: 'period' },
    { name: 'Activewear', slug: 'activewear' },
    { name: 'Comfortwear', slug: 'comfortwear' },
    { name: 'Nightwear', slug: 'nightwear' },
  ]},
  { name: "Girls", slug: 'girls', children: [
    { name: 'Training Bras', slug: 'training-bras' },
    { name: 'Briefs', slug: 'girls-briefs' },
    { name: 'Camisoles', slug: 'camisoles' },
    { name: 'Inner Shorts', slug: 'inner-shorts' },
  ]},
];

const COLLECTIONS = [
  { name: 'Best Sellers', slug: 'best-sellers' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Everyday', slug: 'everyday' },
  { name: 'Active', slug: 'active' },
  { name: 'Period', slug: 'period-collection' },
  { name: 'Sale', slug: 'sale' },
];

async function main() {
  console.log('Seeding Veya database...');

  // Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const parent = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, description: `${cat.name} collection` },
    });
    categoryMap[cat.slug] = parent.id;
    for (const child of cat.children) {
      const c = await db.category.upsert({
        where: { slug: child.slug },
        update: {},
        create: { name: child.name, slug: child.slug, parentId: parent.id },
      });
      categoryMap[child.slug] = c.id;
    }
  }

  // Collections
  const collectionMap: Record<string, string> = {};
  for (const col of COLLECTIONS) {
    const c = await db.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: { name: col.name, slug: col.slug, description: `${col.name} collection` },
    });
    collectionMap[col.slug] = c.id;
  }

  // Suppliers
  const suppliers = await Promise.all([
    db.supplier.upsert({
      where: { id: 'sup-veya-pl' },
      update: {},
      create: { id: 'sup-veya-pl', name: 'Veya Private Label', email: 'pl@veya.demo', qualityScore: 94, dispatchSlaDays: 1 },
    }),
    db.supplier.upsert({
      where: { id: 'sup-comfort-co' },
      update: {},
      create: { id: 'sup-comfort-co', name: 'Comfort Co Manufacturing', email: 'ops@comfortco.demo', qualityScore: 88, dispatchSlaDays: 2 },
    }),
    db.supplier.upsert({
      where: { id: 'sup-activewear' },
      update: {},
      create: { id: 'sup-activewear', name: 'ActiveWear Partners', email: 'fulfil@activewear.demo', qualityScore: 91, dispatchSlaDays: 2 },
    }),
  ]);

  // Warehouses
  for (const [code, city, state] of [['HYD', 'Hyderabad', 'Telangana'], ['BLR', 'Bangalore', 'Karnataka'], ['MUM', 'Mumbai', 'Maharashtra']]) {
    await db.warehouse.upsert({
      where: { code },
      update: {},
      create: { code, name: `Veya ${city}`, city, state, postalCode: '500001', supplierId: suppliers[0].id },
    });
  }

  // Products
  for (const p of PRODUCTS) {
    const catId = categoryMap[p.category] || categoryMap['panties'];
    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: `Premium ${p.title.toLowerCase()} designed for repeat everyday wear. Crafted with ${p.fabric} for all-day comfort and confidence.`,
        shortDescription: `Everyday comfort in ${p.fabric}`,
        fabric: p.fabric,
        material: p.fabric,
        price: p.price,
        mrp: p.mrp,
        costPrice: Math.floor(p.price * 0.42),
        gender: p.gender,
        ageGroup: (p as any).ageGroup || 'ADULT',
        benefits: ['All-day comfort', 'Breathable fabric', 'Easy care'],
        features: ['Tag-free', 'Seamless finish', 'Moisture-wicking'],
        careInstructions: 'Machine wash cold. Do not bleach. Tumble dry low.',
        categoryId: catId,
        featured: p.featured || false,
        bestSeller: p.bestSeller || false,
        newArrival: p.newArrival || false,
        seoTitle: `${p.title} | Veya`,
        seoDescription: `Shop ${p.title} - premium comfortwear by Veya`,
      },
    });

    // Variants
    for (const size of SIZES.slice(0, 3)) {
      for (const color of COLORS.slice(0, 2)) {
        const sku = `${p.slug.substring(0, 6).toUpperCase()}-${size}-${color.substring(0, 3).toUpperCase()}`;
        await db.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            sku,
            size,
            color,
            stock: 30 + Math.floor(Math.random() * 40),
            price: p.price,
            compareAtPrice: p.mrp,
            supplierCost: Math.floor(p.price * 0.42),
          },
        });
      }
    }

    // Images
    await db.productImage.upsert({
      where: { id: `img-${product.id}-1` },
      update: {},
      create: {
        id: `img-${product.id}-1`,
        productId: product.id,
        url: `https://images.unsplash.com/photo-1617331721458-bd3adef5c2c2?w=800&q=80`,
        alt: p.title,
        sort: 0,
      },
    });

    // Supplier products
    const supplierIdx = p.category === 'activewear' ? 2 : p.category.includes('girls') || p.category === 'training-bras' ? 1 : 0;
    await db.supplierProduct.upsert({
      where: { supplierId_productId: { supplierId: suppliers[supplierIdx].id, productId: product.id } },
      update: {},
      create: {
        supplierId: suppliers[supplierIdx].id,
        productId: product.id,
        supplierSku: `SUP-${p.slug}`,
        cost: Math.floor(p.price * 0.42),
        stock: 100,
        leadDays: supplierIdx === 0 ? 1 : 2,
        qualityScore: suppliers[supplierIdx].qualityScore,
      },
    });

    // Collections
    if (p.bestSeller) {
      await db.productCollection.upsert({
        where: { productId_collectionId: { productId: product.id, collectionId: collectionMap['best-sellers'] } },
        update: {},
        create: { productId: product.id, collectionId: collectionMap['best-sellers'] },
      });
    }
    if (p.newArrival) {
      await db.productCollection.upsert({
        where: { productId_collectionId: { productId: product.id, collectionId: collectionMap['new-arrivals'] } },
        update: {},
        create: { productId: product.id, collectionId: collectionMap['new-arrivals'] },
      });
    }
  }

  // Coupons
  await db.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', type: 'PERCENT', value: 10, minOrder: 499, maxDiscount: 200 },
  });
  await db.coupon.upsert({
    where: { code: 'FLAT100' },
    update: {},
    create: { code: 'FLAT100', type: 'FIXED', value: 100, minOrder: 799 },
  });

  // Admin user
  const admin = await db.user.upsert({
    where: { email: 'admin@veya.demo' },
    update: {},
    create: { email: 'admin@veya.demo', name: 'Veya Admin', role: 'SUPER_ADMIN', phone: '+919999999999' },
  });

  // Demo customers
  const customers = await Promise.all([
    db.user.upsert({ where: { email: 'priya@demo.com' }, update: {}, create: { email: 'priya@demo.com', name: 'Priya Sharma', phone: '+919876543210', role: 'CUSTOMER' } }),
    db.user.upsert({ where: { email: 'ananya@demo.com' }, update: {}, create: { email: 'ananya@demo.com', name: 'Ananya Reddy', phone: '+919876543211', role: 'CUSTOMER' } }),
  ]);

  // Settings
  const settings = [
    ['brand.name', 'Veya', 'brand'],
    ['brand.currency', 'INR', 'brand'],
    ['shipping.free_threshold', '999', 'shipping'],
    ['shipping.default_cost', '79', 'shipping'],
    ['cod.enabled', 'true', 'cod'],
    ['cod.max_amount', '5000', 'cod'],
    ['cod.fee', '0', 'cod'],
    ['returns.window_days', '7', 'returns'],
    ['loyalty.points_per_rupee', '1', 'loyalty'],
    ['loyalty.review_points', '50', 'loyalty'],
    ['loyalty.referral_points', '300', 'loyalty'],
    ['tax.default_rate', '5', 'tax'],
  ];
  for (const [key, value, group] of settings) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value, group } });
  }

  // Feature flags
  const flags = ['cod', 'loyalty', 'referral', 'reviews', 'whatsapp', 'bundles'];
  for (const key of flags) {
    await db.featureFlag.upsert({ where: { key }, update: {}, create: { key, enabled: key !== 'whatsapp' } });
  }

  // Homepage sections
  const sections = [
    { key: 'hero', title: 'Comfort that moves.', subtitle: 'The everyday edit', content: { cta: 'Shop collection', ctaSecondary: 'Discover Veya', mediaType: 'gradient' } },
    { key: 'benefits', title: 'The Veya standard', content: { items: [{ title: 'Fit', desc: 'Thoughtful cuts' }, { title: 'Care', desc: 'Easy exchange' }, { title: 'Flow', desc: 'Fast fulfilment' }] } },
    { key: 'announcement', content: { text: 'FREE SHIPPING ABOVE ₹999 · COD AVAILABLE · PRIVATE LABEL QUALITY' } },
  ];
  for (const s of sections) {
    await db.homepageSection.upsert({
      where: { key: s.key },
      update: { content: s.content },
      create: { key: s.key, title: s.title, subtitle: s.subtitle, content: s.content },
    });
  }

  // FAQs
  const faqs = [
    { question: 'What is your return policy?', answer: 'We offer hassle-free returns within 7 days of delivery for unworn items with tags intact. Hygiene products are non-returnable.', category: 'returns' },
    { question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days. Express delivery is available in select cities.', category: 'shipping' },
    { question: 'Is COD available?', answer: 'Yes, Cash on Delivery is available for orders up to ₹5,000 in most pin codes across India.', category: 'payment' },
    { question: 'How do I find my size?', answer: 'Use our Size Assistant on any product page, or refer to the size chart for detailed measurements.', category: 'sizing' },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await db.faq.create({ data: { ...faqs[i], sort: i } });
  }

  // Content pages
  const pages = [
    { title: 'Privacy Policy', slug: 'privacy-policy', content: 'Your privacy is important to us. This policy describes how Veya collects, uses, and protects your personal information. [Legal review required before production.]' },
    { title: 'Terms & Conditions', slug: 'terms', content: 'By using the Veya platform, you agree to these terms. [Legal review required before production.]' },
    { title: 'Shipping Policy', slug: 'shipping-policy', content: 'We ship across India. Free shipping on orders above ₹999. Standard delivery 3-5 business days.' },
    { title: 'Return Policy', slug: 'return-policy', content: 'Returns accepted within 7 days. Items must be unworn with tags. Hygiene products excluded.' },
    { title: 'Contact', slug: 'contact', content: 'Reach us at support@veya.demo or WhatsApp +91 99999 99999.' },
  ];
  for (const page of pages) {
    await db.contentPage.upsert({ where: { slug: page.slug }, update: {}, create: page });
  }

  // Sample reviews
  const firstProduct = await db.product.findFirst();
  if (firstProduct) {
    await db.review.create({
      data: { productId: firstProduct.id, userId: customers[0].id, rating: 5, title: 'Perfect everyday comfort', body: 'So soft and comfortable. I wear these every day!', verifiedPurchase: true, approved: true },
    });
    await db.review.create({
      data: { productId: firstProduct.id, userId: customers[1].id, rating: 4, title: 'Great quality', body: 'Good fabric and fit. Will buy again.', verifiedPurchase: true, approved: true },
    });
  }

  // Sample orders for admin dashboard
  const variant = await db.productVariant.findFirst();
  if (variant) {
    const product = await db.product.findUnique({ where: { id: variant.productId } });
    if (product) {
      for (let i = 0; i < 5; i++) {
        const orderNum = `VEYA-SEED-${1000 + i}`;
        const existing = await db.order.findUnique({ where: { orderNumber: orderNum } });
        if (!existing) {
          const statuses = ['DELIVERED', 'SHIPPED', 'CONFIRMED', 'PAID', 'PENDING_PAYMENT'] as const;
          const status = statuses[i];
          await db.order.create({
            data: {
              orderNumber: orderNum,
              userId: customers[i % 2].id,
              status,
              paymentMethod: i % 2 === 0 ? 'razorpay' : 'cod',
              subtotal: product.price,
              shipping: 0,
              total: product.price,
              address: { name: customers[i % 2].name, phone: customers[i % 2].phone, line1: '123 Demo Street', city: 'Hyderabad', state: 'Telangana', postalCode: '500001' },
              items: { create: [{ productId: product.id, variantId: variant.id, title: product.title, sku: variant.sku, quantity: 1, unitPrice: product.price }] },
              statusHistory: { create: { newStatus: status, actorType: 'system' } },
            },
          });
        }
      }
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
