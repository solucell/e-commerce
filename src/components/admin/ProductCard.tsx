import React from 'react';
import { Edit3, Trash2, Package } from 'lucide-react';

export const ProductCard = ({ product, onEdit, onDelete }: any) => {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800/60 rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-all">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg">
            {product.badge}
          </span>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
            <h4 className="text-sm font-bold text-slate-100">{product.name}</h4>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(product)} className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(product.id)} className="p-2 bg-slate-800 text-red-400/50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400">
            <Package size={14} />
            <span className="text-xs font-bold">{product.stock} un.</span>
          </div>
          <p className="text-lg font-black text-white">R$ {product.price.toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};