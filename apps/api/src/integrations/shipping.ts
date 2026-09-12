export type ShipmentRequest={orderNumber:string;name:string;phone:string;address:any;items:any[];cod:boolean;amount:number};
export type ShipmentResult={provider:string;awb:string;labelUrl?:string;etaDays:number};
export interface ShippingProvider{createShipment(input:ShipmentRequest):Promise<ShipmentResult>;track(awb:string):Promise<any>}
export class MockShippingProvider implements ShippingProvider{
 async createShipment(i:ShipmentRequest){return {provider:'mock',awb:'MOCK-'+Date.now(),etaDays:3}};
 async track(awb:string){return {awb,status:'IN_TRANSIT',events:[]}}
}
export class GenericShippingProvider implements ShippingProvider{
 constructor(private base:string,private key:string){}
 async createShipment(input:ShipmentRequest){const r=await fetch(this.base+'/shipments',{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${this.key}`},body:JSON.stringify(input)});if(!r.ok)throw new Error('Shipping provider error');return r.json()}
 async track(awb:string){const r=await fetch(this.base+'/shipments/'+encodeURIComponent(awb),{headers:{authorization:`Bearer ${this.key}`}});if(!r.ok)throw new Error('Tracking provider error');return r.json()}
}