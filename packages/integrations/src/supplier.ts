export interface SupplierOrder {
  orderNumber: string;
  items: any[];
  address: any;
  blindShipping?: boolean;
}

export interface SupplierProvider {
  createOrder(input: SupplierOrder): Promise<{ externalId: string }>;
  markPacked(id: string): Promise<any>;
  markShipped(id: string, tracking: string, carrier?: string): Promise<any>;
  syncInventory?(supplierSku: string): Promise<{ stock: number }>;
}

export class MockSupplierProvider implements SupplierProvider {
  async createOrder(i: SupplierOrder) {
    return { externalId: `SUP-${i.orderNumber}` };
  }
  async markPacked(id: string) { return { id, status: 'PACKED' }; }
  async markShipped(id: string, tracking: string, carrier = 'Courier') {
    return { id, status: 'SHIPPED', tracking, carrier };
  }
  async syncInventory(sku: string) { return { stock: 50 + Math.floor(Math.random() * 50) }; }
}

export class GenericSupplierProvider implements SupplierProvider {
  constructor(private base: string, private key: string) {}

  private async request(path: string, method = 'GET', body?: any) {
    const r = await fetch(`${this.base}${path}`, {
      method,
      headers: { 'content-type': 'application/json', 'x-api-key': this.key },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw new Error(`Supplier provider error: ${r.status}`);
    return r.json();
  }

  async createOrder(input: SupplierOrder) {
    return this.request('/orders', 'POST', input);
  }
  async markPacked(id: string) { return this.request(`/orders/${id}/packed`, 'POST'); }
  async markShipped(id: string, tracking: string, carrier?: string) {
    return this.request(`/orders/${id}/shipped`, 'POST', { tracking, carrier });
  }
}
