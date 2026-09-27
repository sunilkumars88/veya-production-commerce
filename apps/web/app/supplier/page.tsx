'use client';
import { useEffect, useState } from 'react';
import { PackageCheck, Truck, BarChart3 } from 'lucide-react';
import { api } from '../../lib/api';

export default function SupplierPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);

  const load = () => {
    api.getSupplierOrders().then(setOrders).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: string, body?: any) => {
    await api.supplierAction(id, action, body);
    load();
  };

  return (
    <main className="min-h-screen bg-[#f4efe9]">
      <header className="bg-white border-b border-black/10 px-6 py-6">
        <h1 className="text-3xl md:text-4xl font-bold">Supplier fulfilment</h1>
        <p className="text-black/50 mt-1 text-sm">Accept → pack → ship under private-label rules.</p>
      </header>

      {dashboard && (
        <div className="px-6 py-4 grid grid-cols-4 gap-3">
          {[
            ['Pending', dashboard.pending, 'text-amber-600'],
            ['Processing', dashboard.processing, 'text-blue-600'],
            ['Shipped', dashboard.shipped, 'text-purple-600'],
            ['Delivered', dashboard.delivered, 'text-green-600'],
          ].map(([label, count, color]) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center">
              <p className={`text-2xl font-medium ${color}`}>{count}</p>
              <p className="text-xs text-black/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 py-4 grid gap-3">
        {orders.map(x => (
          <div key={x.id} className="bg-white rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="font-medium">{x.order?.orderNumber}</p>
              <p className="text-sm text-black/50 mt-1">{x.order?.items?.map((i: any) => `${i.title} × ${i.quantity}`).join(', ')}</p>
              <p className="text-xs text-black/40 mt-1">Supplier: {x.supplier?.name}</p>
            </div>
            <span className="text-sm font-medium px-3 py-1 bg-black/5 rounded-full">{x.status}</span>
            <div className="flex gap-2">
              {x.status === 'PENDING' && <button onClick={() => act(x.id, 'accept')} className="bg-black text-white px-4 py-2 rounded-full text-sm">Accept</button>}
              {x.status === 'ACCEPTED' && <button onClick={() => act(x.id, 'packed')} className="bg-black text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"><PackageCheck size={16} /> Packed</button>}
              {x.status === 'PACKED' && <button onClick={() => act(x.id, 'shipped', { trackingNumber: `TRK-${Date.now()}`, carrier: 'SakhiKart Express' })} className="bg-teal text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"><Truck size={16} /> Ship</button>}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-black/40 py-16">No fulfilment orders yet. Orders appear after admin assigns a supplier.</p>}
      </div>
    </main>
  );
}
