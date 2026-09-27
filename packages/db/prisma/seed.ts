import { PrismaClient, Gender, AgeGroup } from '@prisma/client';

const db = new PrismaClient();

const IMG = {
  inner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
  period: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80',
  hygiene: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80',
  baby: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80',
  wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80',
  active: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80',
  night: 'https://images.unsplash.com/photo-1617331721458-bd3adef5c2c2?w=900&q=80',
  socks: 'https://images.unsplash.com/photo-1586355292350-5d2f4e0d0f3a?w=900&q=80',
};

type SeedProduct = {
  title: string;
  slug: string;
  fabric: string;
  price: number;
  mrp: number;
  category: string;
  gender: Gender;
  ageGroup?: AgeGroup;
  bestSeller?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  image?: string;
  hygieneRestricted?: boolean;
};

const PRODUCTS: SeedProduct[] = [
  // Innerwear
  { title: 'CloudSoft Everyday Brief', slug: 'cloudsoft-everyday-brief', fabric: 'Cotton modal blend', price: 399, mrp: 599, category: 'panties', gender: 'WOMEN', bestSeller: true, image: IMG.inner },
  { title: 'DailyForm Comfort Bra', slug: 'dailyform-comfort-bra', fabric: 'Soft stretch microfiber', price: 999, mrp: 1499, category: 'bras', gender: 'WOMEN', bestSeller: true, image: IMG.inner },
  { title: 'MoveFlex Active Bra', slug: 'moveflex-active-bra', fabric: 'Nylon elastane', price: 899, mrp: 1299, category: 'bras', gender: 'WOMEN', featured: true, image: IMG.active },
  { title: 'SilkTouch Lace Bralette', slug: 'silktouch-lace-bralette', fabric: 'Silk blend lace', price: 1199, mrp: 1699, category: 'bras', gender: 'WOMEN', featured: true, image: IMG.inner },
  { title: 'PureCotton Hipster', slug: 'purecotton-hipster', fabric: 'Organic cotton', price: 349, mrp: 499, category: 'panties', gender: 'WOMEN', image: IMG.inner },
  { title: 'SecondSkin Boyshort', slug: 'secondskin-boyshort', fabric: 'Micro-modal stretch', price: 449, mrp: 699, category: 'panties', gender: 'WOMEN', image: IMG.inner },
  { title: 'WireFree Support Bra', slug: 'wirefree-support-bra', fabric: 'Cotton spandex', price: 849, mrp: 1199, category: 'bras', gender: 'WOMEN', image: IMG.inner },
  { title: 'HighWaist Sculpt Brief', slug: 'highwaist-sculpt-brief', fabric: 'Power mesh', price: 649, mrp: 949, category: 'panties', gender: 'WOMEN', image: IMG.inner },
  { title: 'LoungeEase Camisole', slug: 'loungeease-camisole', fabric: 'Bamboo blend', price: 499, mrp: 699, category: 'comfortwear', gender: 'WOMEN', image: IMG.night },
  { title: 'Maternity Support Bra', slug: 'maternity-support-bra', fabric: 'Stretch cotton', price: 949, mrp: 1399, category: 'maternity', gender: 'WOMEN', image: IMG.inner },
  { title: 'Everyday Essential Brief 3-Pack', slug: 'everyday-essential-brief-3pack', fabric: 'Cotton modal', price: 999, mrp: 1497, category: 'panties', gender: 'WOMEN', bestSeller: true, image: IMG.inner },
  { title: 'Comfort Core Bra 2-Pack', slug: 'comfort-core-bra-2pack', fabric: 'Microfiber blend', price: 1599, mrp: 2398, category: 'bras', gender: 'WOMEN', image: IMG.inner },
  { title: 'AirFlow Mesh Bra', slug: 'airflow-mesh-bra', fabric: 'Breathable mesh', price: 799, mrp: 1199, category: 'bras', gender: 'WOMEN', image: IMG.active },
  { title: 'Seamless Sculpt Brief', slug: 'seamless-sculpt-brief', fabric: 'Seamless microfiber', price: 549, mrp: 799, category: 'panties', gender: 'WOMEN', image: IMG.inner },
  { title: 'CottonCloud Tank Bra', slug: 'cottoncloud-tank-bra', fabric: 'Pima cotton', price: 549, mrp: 799, category: 'bras', gender: 'WOMEN', image: IMG.inner },
  // Period
  { title: 'FlowCare Period Brief', slug: 'flowcare-period-brief', fabric: 'Cotton absorbent layers', price: 799, mrp: 1099, category: 'period-wear', gender: 'WOMEN', newArrival: true, image: IMG.period, hygieneRestricted: true },
  { title: 'PeriodGuard Maxi Brief', slug: 'periodguard-maxi-brief', fabric: 'Multi-layer absorbent', price: 899, mrp: 1299, category: 'period-wear', gender: 'WOMEN', bestSeller: true, image: IMG.period, hygieneRestricted: true },
  { title: 'Period Care Starter Kit', slug: 'period-care-starter-kit', fabric: 'Mixed absorbency set', price: 1999, mrp: 2899, category: 'period-care', gender: 'WOMEN', featured: true, image: IMG.period, hygieneRestricted: true },
  { title: 'NightFlow Overnight Brief', slug: 'nightflow-overnight-brief', fabric: 'Heavy-flow layers', price: 949, mrp: 1349, category: 'period-wear', gender: 'WOMEN', image: IMG.period, hygieneRestricted: true },
  { title: 'SoftDays Panty Liners 30s', slug: 'softdays-panty-liners-30s', fabric: 'Cotton top sheet', price: 249, mrp: 349, category: 'period-care', gender: 'WOMEN', image: IMG.period, hygieneRestricted: true },
  { title: 'CalmCycle Hot Water Bag', slug: 'calmcycle-hot-water-bag', fabric: 'Soft fleece cover', price: 399, mrp: 599, category: 'period-care', gender: 'WOMEN', image: IMG.wellness },
  // Intimate hygiene
  { title: 'FreshGuard Intimate Wash 200ml', slug: 'freshguard-intimate-wash', fabric: 'pH balanced formula', price: 299, mrp: 449, category: 'intimate-hygiene', gender: 'WOMEN', bestSeller: true, image: IMG.hygiene, hygieneRestricted: true },
  { title: 'TravelSafe Toilet Seat Covers', slug: 'travelsafe-toilet-seat-covers', fabric: 'Disposable paper', price: 199, mrp: 299, category: 'intimate-hygiene', gender: 'UNISEX', image: IMG.hygiene },
  { title: 'PocketPure Hand & Surface Spray', slug: 'pocketpure-hygiene-spray', fabric: 'Alcohol-based mist', price: 179, mrp: 249, category: 'intimate-hygiene', gender: 'UNISEX', newArrival: true, image: IMG.hygiene },
  { title: 'SoftWipe Intimate Wipes 40s', slug: 'softwipe-intimate-wipes', fabric: 'Aloe cotton wipes', price: 229, mrp: 329, category: 'intimate-hygiene', gender: 'WOMEN', image: IMG.hygiene, hygieneRestricted: true },
  // Active + night
  { title: 'FlexFit Sports Bra', slug: 'flexfit-sports-bra', fabric: 'Performance nylon', price: 1099, mrp: 1599, category: 'activewear', gender: 'WOMEN', newArrival: true, image: IMG.active },
  { title: 'YogaFlex Training Shorts', slug: 'yogaflex-training-shorts', fabric: '4-way stretch', price: 799, mrp: 1149, category: 'activewear', gender: 'WOMEN', image: IMG.active },
  { title: 'BreezeCool Active Top', slug: 'breezecool-active-top', fabric: 'Cooling fabric', price: 799, mrp: 1149, category: 'activewear', gender: 'WOMEN', newArrival: true, image: IMG.active },
  { title: 'NightBloom Sleep Set', slug: 'nightbloom-sleep-set', fabric: 'Modal satin', price: 1499, mrp: 2199, category: 'nightwear', gender: 'WOMEN', image: IMG.night },
  { title: 'DreamWeave Nightgown', slug: 'dreamweave-nightgown', fabric: 'Silk modal', price: 1299, mrp: 1899, category: 'nightwear', gender: 'WOMEN', image: IMG.night },
  { title: 'CloudRest Night Bra', slug: 'cloudrest-night-bra', fabric: 'Soft cotton jersey', price: 649, mrp: 949, category: 'nightwear', gender: 'WOMEN', image: IMG.night },
  // Everyday basics
  { title: 'DayWalk Ankle Socks 5-Pack', slug: 'daywalk-ankle-socks-5pack', fabric: 'Combed cotton', price: 499, mrp: 799, category: 'socks-basics', gender: 'UNISEX', bestSeller: true, image: IMG.socks },
  { title: 'AirKnit Crew Socks 3-Pack', slug: 'airknit-crew-socks-3pack', fabric: 'Breathable knit', price: 449, mrp: 699, category: 'socks-basics', gender: 'UNISEX', image: IMG.socks },
  { title: 'SoftTee Everyday Inner 2-Pack', slug: 'softtee-everyday-inner-2pack', fabric: 'Supima cotton', price: 699, mrp: 999, category: 'socks-basics', gender: 'UNISEX', image: IMG.inner },
  // Girls
  { title: 'FirstStep Training Bra', slug: 'firststep-training-bra', fabric: 'Cotton blend', price: 299, mrp: 449, category: 'training-bras', gender: 'GIRLS', ageGroup: 'TEEN', image: IMG.inner },
  { title: 'GrowEasy Girls Brief 3-Pack', slug: 'groweasy-girls-brief', fabric: 'Soft cotton', price: 399, mrp: 549, category: 'girls-briefs', gender: 'GIRLS', ageGroup: 'TEEN', image: IMG.inner },
  { title: 'TeenFlex Camisole', slug: 'teenflex-camisole', fabric: 'Cotton modal', price: 349, mrp: 499, category: 'camisoles', gender: 'GIRLS', ageGroup: 'TEEN', image: IMG.inner },
  { title: 'ActiveGirl Inner Shorts', slug: 'activegirl-inner-shorts', fabric: 'Stretch cotton', price: 399, mrp: 549, category: 'inner-shorts', gender: 'GIRLS', ageGroup: 'TEEN', image: IMG.active },
  { title: 'TeenPeriod Starter Brief', slug: 'teenperiod-starter-brief', fabric: 'Absorbent cotton', price: 449, mrp: 649, category: 'period-wear', gender: 'GIRLS', ageGroup: 'TEEN', newArrival: true, image: IMG.period, hygieneRestricted: true },
  // Baby & kids
  { title: 'CloudNappy Cloth Diaper Cover', slug: 'cloudnappy-cloth-diaper-cover', fabric: 'PUL waterproof', price: 699, mrp: 999, category: 'cloth-diapers', gender: 'UNISEX', ageGroup: 'CHILD', bestSeller: true, image: IMG.baby },
  { title: 'AbsorbPlus Insert 5-Pack', slug: 'absorbplus-diaper-inserts', fabric: 'Bamboo terry', price: 549, mrp: 799, category: 'cloth-diapers', gender: 'UNISEX', ageGroup: 'CHILD', image: IMG.baby },
  { title: 'GentlePuff Baby Wet Wipes 72s', slug: 'gentlepuff-baby-wipes', fabric: 'Aloe water wipes', price: 199, mrp: 279, category: 'baby-care', gender: 'UNISEX', ageGroup: 'CHILD', image: IMG.baby },
  { title: 'SnugNest Newborn Onesie', slug: 'snugnest-newborn-onesie', fabric: 'Organic cotton', price: 599, mrp: 849, category: 'baby-wear', gender: 'UNISEX', ageGroup: 'CHILD', newArrival: true, image: IMG.baby },
  { title: 'SoftStep Baby Booties', slug: 'softstep-baby-booties', fabric: 'Knit cotton', price: 349, mrp: 499, category: 'baby-wear', gender: 'UNISEX', ageGroup: 'CHILD', image: IMG.baby },
  { title: 'CalmTummy Massage Oil 100ml', slug: 'calmtummy-baby-massage-oil', fabric: 'Cold-pressed oils', price: 449, mrp: 649, category: 'baby-care', gender: 'UNISEX', ageGroup: 'CHILD', image: IMG.wellness },
  { title: 'NightDry Training Pants', slug: 'nightdry-training-pants', fabric: 'Absorbent inner', price: 799, mrp: 1099, category: 'cloth-diapers', gender: 'UNISEX', ageGroup: 'CHILD', image: IMG.baby },
  // Wellness
  { title: 'GlowDrop Face Serum 30ml', slug: 'glowdrop-face-serum', fabric: 'Botanical serum', price: 899, mrp: 1299, category: 'wellness', gender: 'WOMEN', featured: true, image: IMG.wellness },
  { title: 'CalmLeaf Herbal Tea 20s', slug: 'calmleaf-herbal-tea', fabric: 'Caffeine-free blend', price: 349, mrp: 499, category: 'wellness', gender: 'UNISEX', image: IMG.wellness },
  { title: 'PureBar Body Butter 150g', slug: 'purebar-body-butter', fabric: 'Shea + cocoa', price: 549, mrp: 799, category: 'wellness', gender: 'WOMEN', image: IMG.wellness },
  { title: 'DailyGlow Multivitamin 30s', slug: 'dailyglow-multivitamin', fabric: 'Women daily formula', price: 699, mrp: 999, category: 'wellness', gender: 'WOMEN', image: IMG.wellness },
  { title: 'SoftSoak Bath Soak 250g', slug: 'softsoak-bath-soak', fabric: 'Epsom + botanicals', price: 429, mrp: 599, category: 'wellness', gender: 'UNISEX', newArrival: true, image: IMG.wellness },
  { title: 'NursingEase Maternity Brief', slug: 'nursingease-maternity-brief', fabric: 'Stretch cotton', price: 499, mrp: 749, category: 'maternity', gender: 'WOMEN', image: IMG.inner },
  { title: 'PostCare Recovery Belt', slug: 'postcare-recovery-belt', fabric: 'Breathable support', price: 899, mrp: 1299, category: 'maternity', gender: 'WOMEN', image: IMG.inner },
];

const CATEGORIES = [
  { name: 'Innerwear', slug: 'innerwear', children: [
    { name: 'Bras', slug: 'bras' },
    { name: 'Panties', slug: 'panties' },
    { name: 'Comfortwear', slug: 'comfortwear' },
    { name: 'Nightwear', slug: 'nightwear' },
    { name: 'Activewear', slug: 'activewear' },
    { name: 'Maternity', slug: 'maternity' },
  ]},
  { name: 'Period Care', slug: 'period', children: [
    { name: 'Period Wear', slug: 'period-wear' },
    { name: 'Period Care', slug: 'period-care' },
  ]},
  { name: 'Hygiene', slug: 'hygiene', children: [
    { name: 'Intimate Hygiene', slug: 'intimate-hygiene' },
  ]},
  { name: 'Baby & Kids', slug: 'baby-kids', children: [
    { name: 'Cloth Diapers', slug: 'cloth-diapers' },
    { name: 'Baby Care', slug: 'baby-care' },
    { name: 'Baby Wear', slug: 'baby-wear' },
    { name: 'Training Bras', slug: 'training-bras' },
    { name: 'Girls Briefs', slug: 'girls-briefs' },
    { name: 'Camisoles', slug: 'camisoles' },
    { name: 'Inner Shorts', slug: 'inner-shorts' },
  ]},
  { name: 'Everyday', slug: 'everyday-shop', children: [
    { name: 'Socks & Basics', slug: 'socks-basics' },
    { name: 'Wellness', slug: 'wellness' },
  ]},
];

const COLLECTIONS = [
  { name: 'Best Sellers', slug: 'best-sellers' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Everyday', slug: 'everyday' },
  { name: 'Active', slug: 'active' },
  { name: 'Period', slug: 'period-collection' },
  { name: 'Baby Edit', slug: 'baby-edit' },
  { name: 'Sale', slug: 'sale' },
];

async function main() {
  console.log('Seeding Body, Baby, Bloom marketplace...');

  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const parent = await db.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug, description: `Shop ${cat.name} on Body, Baby, Bloom` },
    });
    categoryMap[cat.slug] = parent.id;
    for (const child of cat.children) {
      const c = await db.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, parentId: parent.id },
        create: { name: child.name, slug: child.slug, parentId: parent.id },
      });
      categoryMap[child.slug] = c.id;
    }
  }

  const collectionMap: Record<string, string> = {};
  for (const col of COLLECTIONS) {
    const c = await db.collection.upsert({
      where: { slug: col.slug },
      update: { name: col.name },
      create: { name: col.name, slug: col.slug, description: `${col.name} on Body, Baby, Bloom` },
    });
    collectionMap[col.slug] = c.id;
  }

  const suppliers = await Promise.all([
    db.supplier.upsert({
      where: { id: 'sup-sakhikart-pl' },
      update: { name: 'Body, Baby, Bloom Private Label' },
      create: { id: 'sup-sakhikart-pl', name: 'Body, Baby, Bloom Private Label', email: 'pl@sakhikart.demo', qualityScore: 94, dispatchSlaDays: 1 },
    }),
    db.supplier.upsert({
      where: { id: 'sup-comfort-co' },
      update: {},
      create: { id: 'sup-comfort-co', name: 'Comfort Co Manufacturing', email: 'ops@comfortco.demo', qualityScore: 88, dispatchSlaDays: 2 },
    }),
    db.supplier.upsert({
      where: { id: 'sup-carelabs' },
      update: {},
      create: { id: 'sup-carelabs', name: 'CareLabs Wellness', email: 'hello@carelabs.demo', qualityScore: 91, dispatchSlaDays: 2 },
    }),
    db.supplier.upsert({
      where: { id: 'sup-nestbaby' },
      update: {},
      create: { id: 'sup-nestbaby', name: 'NestBaby Dropship', email: 'fulfil@nestbaby.demo', qualityScore: 90, dispatchSlaDays: 2 },
    }),
  ]);

  for (const [code, city, state] of [['HYD', 'Hyderabad', 'Telangana'], ['BLR', 'Bangalore', 'Karnataka'], ['MUM', 'Mumbai', 'Maharashtra']] as const) {
    await db.warehouse.upsert({
      where: { code },
      update: { name: `Body, Baby, Bloom ${city}` },
      create: { code, name: `Body, Baby, Bloom ${city}`, city, state, postalCode: '500001', supplierId: suppliers[0].id },
    });
  }

  const SIZES = ['S', 'M', 'L'];
  const COLORS = ['Nude', 'Mint'];

  for (const p of PRODUCTS) {
    const catId = categoryMap[p.category] || categoryMap['panties'];
    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        price: p.price,
        mrp: p.mrp,
        fabric: p.fabric,
        featured: p.featured || false,
        bestSeller: p.bestSeller || false,
        newArrival: p.newArrival || false,
        hygieneRestricted: p.hygieneRestricted || false,
        categoryId: catId,
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: `Original Body, Baby, Bloom ${p.title.toLowerCase()} for everyday Indian homes. Made with ${p.fabric}. Dropship-ready with GST invoice support.`,
        shortDescription: p.fabric,
        fabric: p.fabric,
        material: p.fabric,
        price: p.price,
        mrp: p.mrp,
        costPrice: Math.floor(p.price * 0.42),
        gender: p.gender,
        ageGroup: p.ageGroup || 'ADULT',
        benefits: ['Trusted everyday quality', 'Pan-India shipping', 'Easy returns where eligible'],
        features: ['Dropship fulfilment', 'COD on eligible pin codes', 'GST invoice'],
        careInstructions: p.hygieneRestricted ? 'Personal care item. Check pack for usage. Hygiene items are non-returnable.' : 'Follow wash/care label. Keep tags for eligible returns.',
        categoryId: catId,
        featured: p.featured || false,
        bestSeller: p.bestSeller || false,
        newArrival: p.newArrival || false,
        hygieneRestricted: p.hygieneRestricted || false,
        returnEligible: !p.hygieneRestricted,
        seoTitle: `${p.title} | Body, Baby, Bloom`,
        seoDescription: `Buy ${p.title} on Body, Baby, Bloom — India's essentials marketplace.`,
      },
    });

    const sized = ['bras', 'panties', 'period-wear', 'activewear', 'nightwear', 'comfortwear', 'maternity', 'training-bras', 'girls-briefs', 'camisoles', 'inner-shorts', 'baby-wear', 'cloth-diapers'].includes(p.category);
    const variants = sized
      ? SIZES.flatMap(size => COLORS.map(color => ({ size, color })))
      : [{ size: 'OS', color: 'Standard' }];

    for (const v of variants) {
      const sku = `${p.slug.substring(0, 8).toUpperCase().replace(/-/g, '')}-${v.size}-${v.color.substring(0, 3).toUpperCase()}`;
      await db.productVariant.upsert({
        where: { sku },
        update: { price: p.price, compareAtPrice: p.mrp, stock: 80 },
        create: {
          productId: product.id,
          sku,
          size: v.size,
          color: v.color,
          stock: 80,
          price: p.price,
          compareAtPrice: p.mrp,
          supplierCost: Math.floor(p.price * 0.42),
        },
      });
    }

    await db.productImage.deleteMany({ where: { productId: product.id } });
    await db.productImage.create({
      data: { productId: product.id, url: p.image || IMG.inner, alt: p.title, sort: 0 },
    });

    const supplierIdx = ['baby-care', 'baby-wear', 'cloth-diapers'].includes(p.category)
      ? 3
      : ['wellness', 'intimate-hygiene', 'period-care'].includes(p.category)
        ? 2
        : p.category.includes('girls') || p.category === 'training-bras'
          ? 1
          : 0;

    await db.supplierProduct.upsert({
      where: { supplierId_productId: { supplierId: suppliers[supplierIdx].id, productId: product.id } },
      update: { stock: 120, cost: Math.floor(p.price * 0.42) },
      create: {
        supplierId: suppliers[supplierIdx].id,
        productId: product.id,
        supplierSku: `SUP-${p.slug}`,
        cost: Math.floor(p.price * 0.42),
        stock: 120,
        leadDays: 2,
        qualityScore: suppliers[supplierIdx].qualityScore,
      },
    });

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
    if (['cloth-diapers', 'baby-care', 'baby-wear'].includes(p.category)) {
      await db.productCollection.upsert({
        where: { productId_collectionId: { productId: product.id, collectionId: collectionMap['baby-edit'] } },
        update: {},
        create: { productId: product.id, collectionId: collectionMap['baby-edit'] },
      });
    }
  }

  await db.coupon.upsert({
    where: { code: 'BLOOM10' },
    update: { active: true },
    create: { code: 'BLOOM10', type: 'PERCENT', value: 10, minOrder: 499, maxDiscount: 200 },
  });
  await db.coupon.upsert({
    where: { code: 'FLAT100' },
    update: { active: true },
    create: { code: 'FLAT100', type: 'FIXED', value: 100, minOrder: 799 },
  });

  await db.user.upsert({
    where: { email: 'admin@sakhikart.demo' },
    update: { name: 'Body, Baby, Bloom Admin', role: 'SUPER_ADMIN' },
    create: { email: 'admin@sakhikart.demo', name: 'Body, Baby, Bloom Admin', role: 'SUPER_ADMIN', phone: '+919999999998' },
  });

  const customers = await Promise.all([
    db.user.upsert({ where: { email: 'priya@demo.com' }, update: {}, create: { email: 'priya@demo.com', name: 'Priya Sharma', phone: '+919876543210', role: 'CUSTOMER' } }),
    db.user.upsert({ where: { email: 'ananya@demo.com' }, update: {}, create: { email: 'ananya@demo.com', name: 'Ananya Reddy', phone: '+919876543211', role: 'CUSTOMER' } }),
  ]);

  const settings = [
    ['brand.name', 'Body, Baby, Bloom', 'brand'],
    ['brand.tagline', 'She changes. Baby grows. You still bloom.', 'brand'],
    ['brand.currency', 'INR', 'brand'],
    ['shipping.free_threshold', '999', 'shipping'],
    ['shipping.default_cost', '79', 'shipping'],
    ['cod.enabled', 'true', 'cod'],
    ['cod.max_amount', '5000', 'cod'],
    ['cod.fee', '0', 'cod'],
    ['returns.window_days', '7', 'returns'],
    ['loyalty.points_per_rupee', '1', 'loyalty'],
    ['marketplace.vendor_onboarding', 'soon', 'marketplace'],
  ];
  for (const [key, value, group] of settings) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value, group } });
  }

  for (const key of ['cod', 'loyalty', 'referral', 'reviews', 'whatsapp', 'bundles']) {
    await db.featureFlag.upsert({ where: { key }, update: {}, create: { key, enabled: key !== 'whatsapp' } });
  }

  await db.homepageSection.upsert({
    where: { key: 'hero' },
    update: { title: 'Shop everything she needs.', subtitle: 'India’s essentials marketplace' },
    create: { key: 'hero', title: 'Shop everything she needs.', subtitle: 'India’s essentials marketplace', content: { cta: 'Shop now' } },
  });

  await db.faq.deleteMany();
  const faqs = [
    { question: 'What is Body, Baby, Bloom?', answer: 'Body, Baby, Bloom is an India-first marketplace for innerwear, period care, hygiene, baby, and wellness. Tagline: She changes. Baby grows. You still bloom. We fulfil via dropshipping today and will open vendor onboarding next.', category: 'about' },
    { question: 'How do payments work?', answer: 'Pay online with Razorpay (UPI, cards, netbanking) or choose COD on eligible pin codes. Live keys go in environment variables — mock checkout works in development.', category: 'payment' },
    { question: 'How long does delivery take?', answer: 'Most orders ship in 1–2 days from partner warehouses and arrive in 3–5 business days.', category: 'shipping' },
    { question: 'Can I return products?', answer: 'Eligible fashion items can be returned in 7 days unused with tags. Hygiene, period absorbents and opened personal care cannot be returned.', category: 'returns' },
    { question: 'Can I sell on Body, Baby, Bloom?', answer: 'Vendor onboarding is architected (supplier portal + scoring + blind shipping). Apply from Sell on Body, Baby, Bloom — public listings open after KYC.', category: 'sellers' },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await db.faq.create({ data: { ...faqs[i], sort: i } });
  }

  const pages = [
    { title: 'Privacy Policy', slug: 'privacy-policy', content: 'Body, Baby, Bloom collects only what is needed to fulfil orders. Legal review required before production.' },
    { title: 'Terms & Conditions', slug: 'terms', content: 'By using Body, Baby, Bloom you agree to marketplace, dropship and payment terms. Legal review required.' },
    { title: 'Shipping Policy', slug: 'shipping-policy', content: 'Pan-India shipping. Free above ₹999. 3–5 business days typical.' },
    { title: 'Return Policy', slug: 'return-policy', content: '7-day returns on eligible unused items. Hygiene products excluded.' },
    { title: 'Contact', slug: 'contact', content: 'hello@bodybabybloom.demo · WhatsApp +91 99999 99999' },
  ];
  for (const page of pages) {
    await db.contentPage.upsert({ where: { slug: page.slug }, update: { content: page.content, title: page.title }, create: page });
  }

  const firstProduct = await db.product.findFirst({ where: { bestSeller: true } });
  if (firstProduct) {
    await db.review.deleteMany({ where: { productId: firstProduct.id } });
    await db.review.create({
      data: { productId: firstProduct.id, userId: customers[0].id, rating: 5, title: 'Daily essential', body: 'Soft, reliable and arrived quickly. Will reorder on Body, Baby, Bloom.', verifiedPurchase: true, approved: true },
    });
    await db.review.create({
      data: { productId: firstProduct.id, userId: customers[1].id, rating: 4, title: 'Great marketplace find', body: 'Good quality for the price. Checkout was simple.', verifiedPurchase: true, approved: true },
    });
  }

  const variant = await db.productVariant.findFirst();
  if (variant) {
    const product = await db.product.findUnique({ where: { id: variant.productId } });
    if (product) {
      for (let i = 0; i < 5; i++) {
        const orderNum = `SK-SEED-${2000 + i}`;
        const existing = await db.order.findUnique({ where: { orderNumber: orderNum } });
        if (!existing) {
          const statuses = ['DELIVERED', 'SHIPPED', 'CONFIRMED', 'PAID', 'PENDING_PAYMENT'] as const;
          await db.order.create({
            data: {
              orderNumber: orderNum,
              userId: customers[i % 2].id,
              status: statuses[i],
              paymentMethod: i % 2 === 0 ? 'razorpay' : 'cod',
              subtotal: product.price,
              shipping: 0,
              total: product.price,
              address: { name: customers[i % 2].name, phone: customers[i % 2].phone, line1: '12 Market Road', city: 'Hyderabad', state: 'Telangana', postalCode: '500001' },
              items: { create: [{ productId: product.id, variantId: variant.id, title: product.title, sku: variant.sku, quantity: 1, unitPrice: product.price }] },
              statusHistory: { create: { newStatus: statuses[i], actorType: 'system' } },
            },
          });
        }
      }
    }
  }

  console.log(`Seed complete: ${PRODUCTS.length} products on Body, Baby, Bloom.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
