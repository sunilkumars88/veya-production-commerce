export type SupplierOrder={orderNumber:string;items:any[];address:any};
export interface SupplierProvider{createOrder(input:SupplierOrder):Promise<{externalId:string}>;markPacked(id:string):Promise<any>;markShipped(id:string,tracking:string):Promise<any>}
export class MockSupplierProvider implements SupplierProvider{
 async createOrder(i:SupplierOrder){return {externalId:'SUP-'+i.orderNumber}};
 async markPacked(id:string){return {id,status:'PACKED'}};
 async markShipped(id:string,tracking:string){return {id,status:'SHIPPED',tracking}};
}