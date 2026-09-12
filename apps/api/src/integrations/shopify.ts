const version=process.env.SHOPIFY_API_VERSION||'2026-07';
export async function shopifyGraphQL(query:string,variables?:Record<string,any>){
 const domain=process.env.SHOPIFY_STORE_DOMAIN, token=process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
 if(!domain||!token) throw new Error('Shopify credentials not configured');
 const r=await fetch(`https://${domain}/admin/api/${version}/graphql.json`,{method:'POST',headers:{'content-type':'application/json','x-shopify-access-token':token},body:JSON.stringify({query,variables})});
 const j=await r.json(); if(!r.ok||j.errors) throw new Error(JSON.stringify(j.errors||j)); return j.data;
}
export async function getShop(){return shopifyGraphQL(`query{shop{name myshopifyDomain}}`)}
export async function listProducts(){return shopifyGraphQL(`query{products(first:100){nodes{id title handle status variants(first:100){nodes{id sku price inventoryQuantity}}}}}`)}
export async function listOrders(){return shopifyGraphQL(`query{orders(first:100,sortKey:CREATED_AT,reverse:true){nodes{id name displayFinancialStatus displayFulfillmentStatus createdAt}}}`)}
