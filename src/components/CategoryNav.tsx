import React from 'react';
import { LayoutGrid, Zap } from 'lucide-react';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
}

export const CategoryNav = ({ categories, active, onSelect }: Props) => {


  return (
    /* hidden md:block -> esconde no mobile
       top-[111px] -> ajuste fino para colar no header (ajuste conforme necessário)
       bg-white/80 -> fundo branco com transparência
    */
    <nav className="hidden md:block sticky top-[112px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center gap-2 py-2">
          {allCategories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`
                  group flex items-center gap-2.5 px-5 py-2 rounded-full
                  transition-all duration-300 uppercase
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 border border-transparent hover:bg-slate-50'
                  }
                `}
              >
                <div className={`
                  transition-colors
                  ${isActive ? 'text-indigo-500' : 'text-slate-300 group-hover:text-slate-400'}
                `}>
                  {cat.id === 'all' ? <LayoutGrid size={14} strokeWidth={2.5} /> : <Zap size={14} strokeWidth={2.5} />}
                </div>

                <span className="text-[10px] font-black tracking-widest">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};