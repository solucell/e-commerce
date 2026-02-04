import React, { useState } from 'react'
import { LayoutDashboard, Package, FileText, Settings, LogOut, Key, ChevronUp, X, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Tab } from '../../pages/AdminPanel'

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeModal, setActiveModal] = useState<'password' | 'settings' | 'logout' | null>(null)

  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as Tab, label: 'Inventário', icon: Package },
    { id: 'reports' as Tab, label: 'Relatórios', icon: FileText },
  ]

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-[#0b0f1a] border-r border-slate-800/40">
        <div className="flex flex-col flex-grow pt-10 pb-6 overflow-hidden">
        
          <div className="flex items-center gap-3 px-8 mb-12">
    <div className="flex flex-col">
    <div className="w-32 mb-1"> 
      <img 
        src="logo-solucell.png" 
        alt="SoluCell Logo" 
        className="w-full h-auto object-contain object-left" 
      />
    </div>
    <span className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase leading-none">
      Control Center
    </span>
  </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Menu Principal</span>
            </div>
            
            {menuItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  {isActive && <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />}
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-500' : 'group-hover:text-slate-300'}`} />
                  <span className={`text-sm font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Footer Sidebar / Menu do Administrador */}
          <div className="px-6 mt-auto relative">
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-6 right-6 mb-4 bg-[#0f172a] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl z-50"
                >
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setActiveModal('password'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-bold"
                    >
                      <Key size={16} className="text-indigo-500" /> Alterar Senha
                    </button>
                    <button 
                      onClick={() => { setActiveModal('settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-bold"
                    >
                      <Settings size={16} className="text-indigo-500" /> Configurações
                    </button>
                    <div className="h-px bg-slate-800 my-1 mx-4" />
                    <button 
                      onClick={() => { setActiveModal('logout'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-xs font-bold"
                    >
                      <LogOut size={16} /> Sair da Conta
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full p-4 border transition-all duration-300 rounded-[2rem] flex items-center gap-3 group ${
                showUserMenu ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shrink-0" />
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-xs font-bold text-white truncate">Administrador</span>
                <span className="text-[10px] text-slate-500 truncate">Gerenciar conta</span>
              </div>
              <ChevronUp size={16} className={`ml-auto text-slate-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MODAIS DE AÇÃO --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              {activeModal === 'password' && (
                <div className="space-y-6">
                  <header>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Segurança</span>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Alterar Senha</h2>
                  </header>
                  <div className="space-y-3">
                    <Input label="Senha Atual" type="password" />
                    <Input label="Nova Senha" type="password" />
                    <Input label="Confirmar Nova Senha" type="password" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                    <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">Salvar Nova Senha</button>
                  </div>
                </div>
              )}

              {activeModal === 'settings' && (
                <div className="space-y-6">
                  <header>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Preferências</span>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Configurações</h2>
                  </header>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xs font-bold text-slate-700">Notificações de Vendas</span>
                      <div className="w-10 h-5 bg-indigo-500 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-50">
                      <span className="text-xs font-bold text-slate-700">Modo Dark (Em breve)</span>
                      <div className="w-10 h-5 bg-slate-300 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Fechar</button>
                </div>
              )}

              {activeModal === 'logout' && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <LogOut size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none mb-2">Sair do Sistema?</h2>
                    <p className="text-sm text-slate-500 font-medium">Você precisará fazer login novamente para acessar o Control Center.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors">Voltar</button>
                    <button onClick={() => window.location.reload()} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-100">Sim, Sair</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// Componente de Input auxiliar para manter o padrão visual
function Input({ label, type }: { label: string, type: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
      <input 
        type={type}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500/30 transition-all"
      />
    </div>
  )
}