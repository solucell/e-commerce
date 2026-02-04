import { X, ShieldCheck, Truck, Plus, Minus, MessageCircle, Info } from 'lucide-react';
import type { Product } from '../types';
import { useState, useEffect } from 'react';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
}

export const ProductModal = ({ product, onClose, onAddToCart }: Props) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) setQty(1);
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-xl h-[90vh] sm:h-auto overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-500 ease-out">
        
        {/* Botão Fechar - Estilo Flutuante Clean */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 z-20 p-2.5 bg-white/80 backdrop-blur-md text-slate-900 rounded-full shadow-lg border border-slate-100 transition-transform active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col">
          
          {/* SEÇÃO DA IMAGEM: Ocupando 100% da largura superior */}
          <div className="w-full relative aspect-square sm:aspect-video bg-[#F8F9FA] flex items-center justify-center overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply p-4 sm:p-8 transition-transform duration-1000 hover:scale-110" 
            />
          </div>

          {/* CONTEÚDO INFO */}
          <div className="px-6 py-8 sm:px-10 sm:pb-10 flex flex-col bg-white -mt-6 relative z-10 rounded-t-[2rem]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <div className="w-6 h-[2px] bg-indigo-600" />
                Ficha Técnica
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tighter">
                {product.name}
              </h2>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={14} strokeWidth={2.5} /> Original
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Truck size={14} strokeWidth={2.5} /> Envio Imediato
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="my-8 space-y-3">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Descrição do Produto</h4>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium">
                {product.description || "Este item premium foi selecionado pela Solucell para garantir a melhor experiência tecnológica. Qualidade garantida com suporte pós-venda especializado."}
              </p>
            </div>

            {/* RODAPÉ DE COMPRA */}
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex items-baseline justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Preço</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-slate-900">R$</span>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                      {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Seletor de Qtd Premium */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200/50">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
                    <Minus size={18} strokeWidth={3} />
                  </button>
                  <span className="w-8 text-center font-black text-slate-900 text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => { onAddToCart(product, qty); onClose(); }}
                  className="bg-slate-900 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Adicionar à Sacola
                </button>
                
                <a 
                  href={`https://wa.me/SEUNUMERO?text=Olá! Tenho dúvida sobre o ${product.name}`}
                  target="_blank"
                  className="border-2 border-emerald-500/20 text-emerald-600 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};