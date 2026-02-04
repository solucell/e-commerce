import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, MessageCircle, ChevronRight, X, Search,
  Truck, Zap, DollarSign, AlertCircle, Trash2, CheckCircle2, MapPin, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, query, onSnapshot, orderBy, 
  doc, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase'; 

interface OrderItem { 
  name: string; 
  quantity: number; 
  price: number; 
  image?: string; 
}

interface Order {
  id: string;
  displayId: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  type: 'balcao' | 'motoboy';
  status: 'pendente' | 'rota' | 'finalizado';
  time: string;
  paymentMethod: string;
  address?: string;
  total: number;
}

export default function SoluCellDashboard() {
  const [activeTab, setActiveTab] = useState<'balcao' | 'motoboy'>('balcao');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedOrders = snapshot.docs.map(document => {
        const data = document.data();
        return {
          id: document.id,
          displayId: document.id.slice(-5).toUpperCase(),
          customer: data.customer || 'SEM NOME',
          phone: data.phone || '',
          items: data.items || [],
          type: data.deliveryType || 'balcao',
          status: data.status || 'pendente',
          time: data.createdAt?.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || '--:--',
          paymentMethod: data.payment || 'PIX',
          address: data.address,
          total: data.total || 0
        } as Order;
      });
      setOrders(loadedOrders);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'orders', id), { status: newStatus });
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      (o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.displayId.includes(searchTerm.toUpperCase())) && 
      o.type === activeTab &&
      o.status !== 'finalizado'
    );
  }, [orders, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    pendentes: orders.filter(o => o.status === 'pendente' && o.status !== 'finalizado').length,
    emRota: orders.filter(o => o.status === 'rota').length,
    totalAtivos: orders.filter(o => o.status !== 'finalizado').length,
    vendas: orders.reduce((acc, o) => acc + o.total, 0)
  }), [orders]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-20">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <Zap size={16} fill="currentColor" />
              </div>
              <h1 className="text-xl font-black uppercase italic tracking-tighter">SoluCell<span className="text-indigo-600">.</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Painel ao vivo</div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['balcao', 'motoboy'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                {tab === 'balcao' ? 'Loja' : 'Entrega'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 space-y-6">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Aguardando" value={stats.pendentes} color="amber" />
          <MetricCard label="Em Rota" value={stats.emRota} color="indigo" />
          <MetricCard label="Ativos hoje" value={stats.totalAtivos} color="rose" />
          <MetricCard label="Vendas" value={`R$${stats.vendas.toFixed(0)}`} color="emerald" />
        </section>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar cliente ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 shadow-sm transition-all"
          />
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence mode='popLayout'>
            {filteredOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedOrder(order)}
                className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all shadow-sm group hover:border-indigo-200 cursor-pointer"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">#{order.displayId}</span>
                    <span className="text-[9px] font-bold text-slate-400">{order.time}</span>
                  </div>
                  <h3 className="font-black text-slate-800 text-sm uppercase truncate pr-2">{order.customer}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{order.paymentMethod} • {order.items.length} itens</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-slate-900 mb-1 leading-none">R${order.total.toFixed(0)}</p>
                  <div className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${order.status === 'rota' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {order.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </main>
      </div>

      {/* DRAWER COM IMAGEM CORRIGIDA */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex flex-col md:items-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative mt-auto md:mt-0 h-[92%] md:h-full w-full md:max-w-md bg-white rounded-t-[2.5rem] md:rounded-none flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Detalhes do Pedido</span>
                  <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">{selectedOrder.customer}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-transform"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/50 shadow-sm text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Pagamento</p>
                    <p className="text-[10px] font-black uppercase text-slate-700">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/50 shadow-sm text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tipo de Entrega</p>
                    <p className="text-[10px] font-black uppercase text-slate-700">{selectedOrder.type}</p>
                  </div>
                </div>

                {selectedOrder.address && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <p className="text-[8px] font-black text-indigo-500 uppercase mb-1 flex items-center gap-1"><MapPin size={10}/> Endereço</p>
                    <p className="text-xs font-bold text-slate-700 leading-snug italic uppercase">{selectedOrder.address}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Itens</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        {/* TRATAMENTO DE IMAGEM */}
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 relative">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Se o link falhar, remove a imagem e mostra o ícone
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={18} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase truncate leading-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400">Qtd: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">R${(item.price * item.quantity).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 space-y-4 shadow-lg">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Total</span>
                  <p className="text-4xl font-black tracking-tighter text-slate-900 italic">R$ {selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`https://wa.me/${selectedOrder.phone.replace(/\D/g, '')}`)} 
                    className="w-14 h-14 flex items-center justify-center bg-emerald-500 text-white rounded-2xl active:scale-90 transition-all"
                  >
                    <MessageCircle size={24} />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status === 'pendente' && selectedOrder.type === 'motoboy' ? 'rota' : 'finalizado')}
                    className="flex-1 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {selectedOrder.type === 'balcao' || selectedOrder.status === 'rota' ? (
                      <><CheckCircle2 size={18} /> Finalizar Pedido</>
                    ) : (
                      <><Truck size={18} /> Sair para Entrega</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, color }: any) {
  const colors: any = {
    amber: "bg-amber-500 shadow-amber-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
    rose: "bg-rose-500 shadow-rose-100",
    emerald: "bg-emerald-600 shadow-emerald-100"
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3 active:scale-95 transition-transform">
      <div className={`w-1 h-8 rounded-full ${colors[color]} shadow-md`} />
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-base font-black text-slate-900 leading-none mt-0.5 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}