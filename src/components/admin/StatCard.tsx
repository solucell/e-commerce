import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const StatCard = ({ title, value, icon, color, bg }: StatCardProps) => {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800/60 p-4 lg:p-6 rounded-3xl backdrop-blur-sm group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <h3 className={`text-xl lg:text-2xl font-black ${color} tracking-tighter`}>
          {value}
        </h3>
        {/* Opcional: indicador de crescimento/tendência */}
        <span className="text-[8px] font-bold text-slate-600 uppercase">Hoje</span>
      </div>
    </div>
  );
};