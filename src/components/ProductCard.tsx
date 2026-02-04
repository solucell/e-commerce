import React from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetails: (p: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onOpenDetails }: Props) => {
  // Fallback para imagem caso não exista
  const displayImage = product.image || 'https://placehold.co/400x400?text=Sem+Foto';
  const price = product.price || 0;
  const hasStock = product.stock > 0;

  return (
    <div className="group relative bg-white rounded-3xl p-3 transition-all duration-500 border border-slate-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <div className="flex gap-4 items-center">
        
        {/* Lado Esquerdo: Imagem */}
        <div 
          onClick={() => onOpenDetails(product)}
          className="cursor-pointer relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 bg-[#F8F9FA] rounded-2xl overflow-hidden flex items-center justify-center"
        >
          <img 
            src={displayImage} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          
          {/* Badge dinâmica (Usa o campo 'tag' do formulário) */}
          {product.tag && (
            <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase z-10 shadow-sm">
              {product.tag}
            </div>
          )}

          {/* Overlay se estiver esgotado */}
          {!hasStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
               <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Esgotado</span>
            </div>
          )}
        </div>

        {/* Lado Direito: Informações */}
        <div className="flex-1 min-w-0 flex flex-col h-28 sm:h-32 justify-between py-0.5">
          <div onClick={() => onOpenDetails(product)} className="cursor-pointer space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-500">
              <ShieldCheck size={10} strokeWidth={3} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Original Solucell</span>
            </div>

            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full ${hasStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {hasStock ? 'Pronta Entrega' : 'Indisponível'}
              </span>
            </div>
          </div>

          {/* Preço e Botão Adicionar */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-300 font-bold line-through">
                R$ {(price * 1.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <div className="flex items-baseline gap-0.5 text-slate-900">
                <span className="text-[9px] font-black">R$</span>
                <span className="text-lg sm:text-xl font-black">
                  {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (hasStock) onAddToCart(product);
              }} 
              disabled={!hasStock}
              className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all active:scale-90 shadow-sm
                ${hasStock 
                  ? 'bg-slate-900 hover:bg-indigo-600 text-white cursor-pointer' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
              `}
              title={hasStock ? "Adicionar ao carrinho" : "Produto esgotado"}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};