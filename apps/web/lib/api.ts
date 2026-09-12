const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...options?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || 'Request failed');
  return json.data ?? json;
}

export const api = {
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/api/v1/products${qs}`);
  },
  getProduct: (slug: string) => request<any>(`/api/v1/products/${slug}`),
  search: (q: string, filters?: Record<string, string>) => {
    const qs = new URLSearchParams({ q, ...filters }).toString();
    return request<any>(`/api/v1/products/search?${qs}`);
  },
  suggest: (q: string) => request<string[]>(`/api/v1/products/search/suggest?q=${encodeURIComponent(q)}`),
  getCategories: () => request<any[]>('/api/v1/catalog/categories'),
  getCategory: (slug: string) => request<any>(`/api/v1/catalog/categories/${slug}`),
  getCollections: () => request<any[]>('/api/v1/catalog/collections'),
  getCollection: (slug: string) => request<any>(`/api/v1/catalog/collections/${slug}`),
  getHomepage: () => request<any>('/api/v1/catalog/homepage'),
  getPage: (slug: string) => request<any>(`/api/v1/catalog/pages/${slug}`),
  checkPincode: (pincode: string, amount?: number) =>
    request<any>(`/api/v1/checkout/pincode/${pincode}?amount=${amount || 0}`),
  createCheckout: (data: any) => request<any>('/api/v1/checkout/create', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data: any) => request<any>('/api/v1/checkout/verify', { method: 'POST', body: JSON.stringify(data) }),
  applyCoupon: (code: string, subtotal: number) =>
    request<any>('/api/v1/checkout/coupon', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  getOrder: (number: string) => request<any>(`/api/v1/orders/${number}`),
  createReturn: (data: any) => request<any>('/api/v1/orders/returns', { method: 'POST', body: JSON.stringify(data) }),
  recommendSize: (data: any) => request<any>('/api/v1/size/recommend', { method: 'POST', body: JSON.stringify(data) }),
  getAdminDashboard: (token: string) =>
    request<any>('/api/v1/admin/dashboard', { headers: { 'x-admin-token': token } }),
  getAdminOrders: (token: string) =>
    request<any>('/api/v1/admin/orders', { headers: { 'x-admin-token': token } }),
  fulfillOrder: (token: string, id: string) =>
    request<any>(`/api/v1/admin/orders/${id}/fulfill`, { method: 'POST', headers: { 'x-admin-token': token } }),
  shipOrder: (token: string, id: string) =>
    request<any>(`/api/v1/admin/orders/${id}/ship`, { method: 'POST', headers: { 'x-admin-token': token } }),
  getSupplierOrders: () => request<any[]>('/api/v1/supplier/orders'),
  supplierAction: (id: string, action: string, body?: any) =>
    request<any>(`/api/v1/supplier/orders/${id}/${action}`, { method: 'POST', body: JSON.stringify(body || {}) }),
};

export { API };
