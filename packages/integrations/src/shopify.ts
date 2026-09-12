const version = process.env.SHOPIFY_API_VERSION || '2026-07';

export async function shopifyGraphQL(query: string, variables?: Record<string, any>) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) throw new Error('Shopify credentials not configured');

  const r = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-shopify-access-token': token },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error(JSON.stringify(j.errors || j));
  return j.data;
}

export async function getShop() {
  return shopifyGraphQL(`query { shop { name myshopifyDomain email currencyCode } }`);
}

export async function listProducts() {
  return shopifyGraphQL(`query {
    products(first: 100) {
      nodes {
        id title handle status description
        variants(first: 100) { nodes { id sku price inventoryQuantity barcode } }
        images(first: 10) { nodes { url altText } }
      }
    }
  }`);
}

export async function listOrders() {
  return shopifyGraphQL(`query {
    orders(first: 50, sortKey: CREATED_AT, reverse: true) {
      nodes { id name displayFinancialStatus displayFulfillmentStatus createdAt totalPriceSet { shopMoney { amount } } }
    }
  }`);
}

export async function syncProductToLocal(db: any, shopifyProduct: any, categoryId: string) {
  const variant = shopifyProduct.variants?.nodes?.[0];
  const price = variant ? Math.round(parseFloat(variant.price) * 100) : 0;

  return db.product.upsert({
    where: { shopifyProductId: shopifyProduct.id },
    update: {
      title: shopifyProduct.title,
      description: shopifyProduct.description || shopifyProduct.title,
      active: shopifyProduct.status === 'ACTIVE',
    },
    create: {
      title: shopifyProduct.title,
      slug: shopifyProduct.handle || shopifyProduct.title.toLowerCase().replace(/\s+/g, '-'),
      description: shopifyProduct.description || shopifyProduct.title,
      price,
      mrp: price,
      categoryId,
      shopifyProductId: shopifyProduct.id,
      active: shopifyProduct.status === 'ACTIVE',
    },
  });
}
