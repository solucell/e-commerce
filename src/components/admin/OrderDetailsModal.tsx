import React, { useState } from 'react';
import { X, User, MessageCircle, MapPin, Truck, UserCheck, CheckCircle2, Clock } from 'lucide-react';

export const OrderDetailsModal = ({ order, onClose, onFinalize }: any) => {
  const [handledBy, setHandledBy] = useState(order.handledBy || '');

  const handleWhatsApp = () => {
    const cleanNumber = order.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Sou da Solucell. Gostaria de falar sobre o seu pedido #${order.id}.`);
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-8 flex justify-between items-start border-b border-slate-800/50">
          <div>
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Ticket #{order.id}</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Detalhes da Operação</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center"><User size={24} /></div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase">Cliente</p>
                <p className="text-sm text-slate-300 font-bold">{order.customer}</p>
              </div>
            </div>
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase">
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center"><MapPin size={24} /></div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 font-black uppercase">Destino</p>
              <p className="text-sm text-slate-300 leading-relaxed">{order.address}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">{order.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-[#0f172a]/60 rounded-3xl border border-slate-700/50">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400">
              {order.type.includes('Motoboy') ? <Truck size={22} /> : <UserCheck size={22} />}
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-slate-500 font-black uppercase block mb-1">
                {order.type.includes('Motoboy') ? 'Quem entregou?' : 'Vendedor Responsável'}
              </label>
              {order.status !== 'Concluído' ? (
                <input 
                  type="text" value={handledBy} onChange={(e) => setHandledBy(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white outline-none w-full border-b border-slate-700 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="Digite o nome..."
                />
              ) : (
                <p className="text-sm font-bold text-emerald-400">{order.handledBy}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            {order.status !== 'Concluído' ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => onFinalize(order.id, handledBy)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[11px] transition-all"
                >
                  <CheckCircle2 size={18} /> Finalizar Pedido
                </button>
                <button onClick={onClose} className="bg-slate-800 text-slate-300 py-4 rounded-2xl font-black uppercase text-[11px]">Voltar</button>
              </div>
            ) : (
              <button onClick={onClose} className="w-full bg-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase text-[11px] border border-slate-700">Ticket Finalizado</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};