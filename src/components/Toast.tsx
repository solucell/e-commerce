import { CheckCircle2 } from 'lucide-react';

interface Props {
  show: boolean;
  message: string;
}

export const Toast = ({ show, message }: Props) => {
  if (!show) return null;

  return (
    // Container fixo que garante centralização em qualquer tela
    <div className="fixed bottom-10 left-0 right-0 px-6 z-[200] flex justify-center pointer-events-none">
      <div className="
        bg-slate-900 text-white 
        px-6 py-4 rounded-2xl 
        shadow-[0_20px_40px_rgba(0,0,0,0.3)] 
        flex items-center gap-3 
        border border-white/10
        animate-in fade-in slide-in-from-bottom-8 duration-300
        max-w-xs sm:max-w-md w-full
      ">
        <div className="bg-emerald-500 p-1 rounded-full">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        
        <span className="text-sm font-bold tracking-tight">
          {message}
        </span>
        
        {/* Barra de progresso sutil opcional (decorativa) */}
        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/30 rounded-full w-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-progress" />
        </div>
      </div>
    </div>
  );
};