'use client';
import { useEffect, useState } from 'react';
import { RefreshCw, PackageCheck, Truck, IndianRupee, Users, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';

const TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev-admin-token';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [orders, setOrders] = useState<any>({ items: [] });
  const [tab, setTab] = useState('dashboard');

  const load = () => {
    api.getAdminDashboard(TOKEN).then(setData).catch(console.error);
    api.getAdminOrders(TOKEN).then(setOrders).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const fulfill = async (id: string) => { await api.fulfillOrder(TOKEN, id); load(); };
  const ship = async (id: string) => { await api.shipOrder(TOKEN, id); load(); };

  const kpis = data?.kpis || {};

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-white/40 tracking-[.2em]">BODY BABY BLOOM · COMMERCE OS</p>
          <h1 className="text-2xl mt-1">Marketplace operations</h1>
        </div>
        <button onClick={load} className="border border-white/20 rounded-xl p-3 hover:bg-white/5"><RefreshCw size={18} /></button>
      </header>

      <nav className="border-b border-white/10 px-6 flex gap-6 text-sm">
        {['dashboard', 'orders', 'products', 'customers'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`py-3 capitalize ${tab === t ? 'text-white border-b-2 border-white' : 'text-white/40'}`}>{t}</button>
        ))}
      </nav>

      <div className="p-6 md:p-10">
        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                [IndianRupee, 'Revenue', `₹${(kpis.revenue || 0).toLocaleString('en-IN')}`],
                [PackageCheck, 'Orders', kpis.orders || 0],
                [Users, 'Products', kpis.products || 0],
                [AlertTriangle, 'Low Stock', kpis.lowStock || 0],
              ].map(([Icon, label, value]: any) => (
                <div key={label} className="bg-white/5 rounded-2xl p-5 md:p-6">
                  <Icon size={18} className="text-white/40" />
                  <p className="text-white/40 text-sm mt-3">{label}</p>
                  <p className="text-2xl md:text-3xl mt-1 font-medium">{value}</p>
                </div>
              ))}
            </div>
            {data?.statusBreakdown && (
              <div className="mt-8 bg-white/5 rounded-2xl p-6">
                <h3 className="text-sm text-white/40 mb-4">Order status breakdown</h3>
                <div className="flex flex-wrap gap-3">
                  {data.statusBreakdown.map((s: any) => (
                    <span key={s.status} className="bg-white/10 px-3 py-1.5 rounded-full text-xs">{s.status}: {s._count}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 font-medium">Order queue</div>
            {(orders.items || []).map((x: any) => (
              <div key={x.id} className="p-5 border-b border-white/10 grid md:grid-cols-5 gap-4 items-center text-sm">
                <div>
                  <p className="font-medium">{x.orderNumber}</p>
                  <p className="text-white/40 text-xs mt-1">{x.items?.map((i: any) => i.title).join(', ')}</p>
                </div>
                <p>₹{x.total?.toLocaleString('en-IN')}</p>
                <p><span className="text-emerald-400">{x.status}</span></p>
                <p className="text-white/40 text-xs">{x.paymentMethod}</p>
                <div className="flex gap-2 justify-end">
                  {!x.fulfillment && <button onClick={() => fulfill(x.id)} className="bg-white text-black px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><PackageCheck size={14} /> Assign</button>}
                  {x.fulfillment && x.status !== 'SHIPPED' && <button onClick={() => ship(x.id)} className="bg-white/10 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><Truck size={14} /> Ship</button>}
                </div>
              </div>
            ))}
            {(!orders.items || orders.items.length === 0) && <p className="p-8 text-center text-white/40">No orders yet</p>}
          </div>
        )}

        {tab === 'products' && <p className="text-white/40">Product management — use API /api/v1/admin/products</p>}
        {tab === 'customers' && <p className="text-white/40">Customer management — use API /api/v1/admin/customers</p>}
      </div>
    </main>
  );
}
