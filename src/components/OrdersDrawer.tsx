import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { 
  X, Search, Package, Clock, CheckCircle2, 
  MessageCircle, ArrowRight, Loader2, Calendar
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersDrawer = ({ isOpen, onClose }: Props) => {
  // 1. Inicia o estado com o que estiver salvo no localStorage (sincronizado com CartDrawer)
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('@solucell:phone') || '';
  });
  
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 2. AUTO-BUSCA: Quando o drawer abrir, se já tiver telefone, ele busca sozinho
  useEffect(() => {
    if (isOpen && phone.length >= 14) {
      fetchOrders();
    }
  }, [isOpen]);

  const formatPhone = (v: string) => {
    const x = v.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    if (!x) return;
    const formatted = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
    setPhone(formatted);
    // Opcional: Salvar aqui também para manter sincronizado se ele mudar no histórico
    localStorage.setItem('@solucell:phone', formatted);
  };

  const fetchOrders = async () => {
    if (phone.length < 14) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      const q = query(
        collection(db, 'orders'),
        where('phone', '==', phone),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      // DICA: Se der erro de índice no console do navegador, clique no link que o Firebase gera.
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">Meus Pedidos</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Histórico de compras</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-6 bg-white border-b border-slate-100">
          <div className="relative">
            <input 
              type="tel" 
              placeholder="Digite seu WhatsApp (00) 00000-0000"
              value={phone}
              onChange={(e) => formatPhone(e.target.value)}
              className="w-full p-4 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
            />
            <button 
              onClick={fetchOrders}
              disabled={loading || phone.length < 14}
              className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl disabled:opacity-30 transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
             <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase">Buscando na Solucell...</p>
             </div>
          ) : !hasSearched ? (
            <div className="text-center py-20 opacity-40">
              <Package size={48} className="mx-auto mb-4" />
              <p className="text-sm font-bold">Confirme seu número para ver seus pedidos.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 font-bold">Nenhum pedido encontrado para este número.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase italic">Pedido #{order.id.slice(-5).toUpperCase()}</span>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold mt-1">
                      <Calendar size={12} />
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recent'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    order.status === 'pendente' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs font-medium text-slate-600">
                      <span className="font-bold">{item.quantity}x {item.name}</span>
                      <span className="font-black text-slate-900">R$ {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Total pago</p>
                    <p className="text-lg font-black text-slate-900 tracking-tighter">R$ {order.total.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => window.open(`https://wa.me/5531975413394?text=Olá, quero saber o status do meu pedido #${order.id.slice(-5).toUpperCase()}`, '_blank')}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    title="Suporte via WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};