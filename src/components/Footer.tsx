import React from 'react';
import { 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Zap, 
  CreditCard 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="bg-[#0f172a] text-slate-400 border-t border-white/5">


      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Coluna 1: Sobre */}
          <div className="space-y-6">
            <img src="logo-solucell.png" alt="Solucell" className="h-8 w-auto brightness-125" />
            <p className="text-sm leading-relaxed">
              Especialistas em acessórios premium para smartphones. 
              Qualidade, garantia e o melhor atendimento da região.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Categorias */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-6">Categorias</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Smartphones</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Fones de Ouvido</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Carregadores & Cabos</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Capas & Películas</a></li>
            </ul>
          </div>


          {/* Coluna 4: Contato */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-6">Atendimento</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 shrink-0" />
                <span>R. Melo Franco, 216 - Jardim da Glória, Vespasiano</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 shrink-0" />
                <span>R. Sete de Setembro, 174 - Vila Esportiva, Vespasiano</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-500 shrink-0" />
                <span>(31) 99838-1097</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. COPYRIGHT */}
      <div className="border-t border-white/5 py-8 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <p>© {currentYear} SOLUCELL - Todos os direitos reservados.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;