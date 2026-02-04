import React, { useState } from 'react'
import { LayoutDashboard, Package, FileText, UserCircle, X, Key, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Tab, AdminModal } from '../../pages/AdminPanel'

interface BottomNavProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  openAdminModal: (modal: AdminModal) => void // Nome exato da prop no AdminPanel
}

export default function BottomNav({ activeTab, setActiveTab, openAdminModal }: BottomNavProps) {
  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Início', icon: LayoutDashboard },
    { id: 'inventory' as Tab, label: 'Estoque', icon: Package },
    { id: 'reports' as Tab, label: 'Relatórios', icon: FileText },
  ]

  // Função para abrir o modal global e fechar a gaveta mobile
  const handleAction = (modalType: AdminModal) => {
    openAdminModal(modalType)
    setShowAdminMenu(false)
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0b0f1a] border-t border-slate-800/50 px-2 pb-safe-area z-50">
        <div className="flex items-center justify-around h-16">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id && !showAdminMenu
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowAdminMenu(false); }}
                className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:opacity-60"
              >
                <div className={`absolute top-0 w-8 h-[2px] rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-transparent'}`} />
                <item.icon className={`w-5 h-5 mb-1 transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-500'}`} />
                <span className={`text-[10px] font-medium tracking-tight transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}

          <button
            onClick={() => setShowAdminMenu(true)}
            className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:opacity-60"
          >
            <div className={`absolute top-0 w-8 h-[2px] rounded-full transition-all duration-300 ${showAdminMenu ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-transparent'}`} />
            <UserCircle className={`w-5 h-5 mb-1 transition-colors ${showAdminMenu ? 'text-indigo-500' : 'text-slate-500'}`} />
            <span className={`text-[10px] font-medium tracking-tight transition-colors ${showAdminMenu ? 'text-indigo-400' : 'text-slate-600'}`}>
              Perfil
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showAdminMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminMenu(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 rounded-t-[2.5rem] z-[70] p-6 pb-12 lg:hidden"
            >
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-8" />

              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20" />
                <div>
                  <h3 className="text-white font-bold">Administrador</h3>
                  <p className="text-slate-500 text-xs">techstore.admin@syst</p>
                </div>
                <button onClick={() => setShowAdminMenu(false)} className="ml-auto p-2 bg-slate-900 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <button onClick={() => handleAction('password')} className="w-full flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/50 rounded-2xl text-slate-300 transition-colors">
                  <Key size={20} className="text-indigo-500" />
                  <span className="text-sm font-bold">Alterar Senha</span>
                </button>
                
                <button onClick={() => handleAction('settings')} className="w-full flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/50 rounded-2xl text-slate-300 transition-colors">
                  <Settings size={20} className="text-indigo-500" />
                  <span className="text-sm font-bold">Configurações</span>
                </button>

                <div className="py-2" />

                <button onClick={() => handleAction('logout')} className="w-full flex items-center gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 transition-colors">
                  <LogOut size={20} />
                  <span className="text-sm font-bold">Sair da Conta</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}