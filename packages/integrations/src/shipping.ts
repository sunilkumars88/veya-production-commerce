export interface ShipmentRequest {
  orderNumber: string;
  name: string;
  phone: string;
  address: any;
  items: any[];
  cod: boolean;
  amount: number;
  weightGrams?: number;
}

export interface ShipmentResult {
  provider: string;
  awb: string;
  labelUrl?: string;
  etaDays: number;
}

export interface ServiceabilityResult {
  serviceable: boolean;
  codAvailable: boolean;
  etaDays: number;
  shippingCost: number;
}

export interface ShippingProvider {
  checkServiceability(pincode: string, amount?: number): Promise<ServiceabilityResult>;
  createShipment(input: ShipmentRequest): Promise<ShipmentResult>;
  track(awb: string): Promise<any>;
  cancelShipment(awb: string): Promise<void>;
}

export class MockShippingProvider implements ShippingProvider {
  async checkServiceability(pincode: string, amount = 0): Promise<ServiceabilityResult> {
    const serviceable = /^[1-9][0-9]{5}$/.test(pincode);
    const freeThreshold = 999;
    const defaultCost = 79;
    const subtotal = amount;
    return {
      serviceable,
      codAvailable: serviceable && amount <= 5000,
      etaDays: 3,
      shippingCost: subtotal >= freeThreshold ? 0 : defaultCost,
    };
  }

  async createShipment(i: ShipmentRequest): Promise<ShipmentResult> {
    return { provider: 'mock', awb: `MOCK-${Date.now()}`, etaDays: 3 };
  }

  async track(awb: string) {
    return { awb, status: 'IN_TRANSIT', events: [{ status: 'PICKED_UP', timestamp: new Date().toISOString() }] };
  }

  async cancelShipment(_awb: string) {}
}

export class GenericShippingProvider implements ShippingProvider {
  constructor(private base: string, private key: string) {}

  private async request(path: string, method = 'GET', body?: any) {
    const r = await fetch(`${this.base}${path}`, {
      method,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.key}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw new Error(`Shipping provider error: ${r.status}`);
    return r.json();
  }

  async checkServiceability(pincode: string, amount?: number) {
    return this.request(`/serviceability?pincode=${pincode}&amount=${amount || 0}`);
  }

  async createShipment(input: ShipmentRequest) {
    return this.request('/shipments', 'POST', input);
  }

  async track(awb: string) {
    return this.request(`/shipments/${encodeURIComponent(awb)}`);
  }

  async cancelShipment(awb: string) {
    await this.request(`/shipments/${encodeURIComponent(awb)}/cancel`, 'POST');
  }
}
