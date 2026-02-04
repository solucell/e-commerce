import React, { useState } from 'react'
import Sidebar from '../components/admin/SidebarItem'
import BottomNav from '../components/admin/MobileNavItem'
import DashboardView from '../components/admin/DashboardView'
import Inventory from '../components/admin/InventoryView'
import Reports from '../components/admin/ReportsView'
import ProductForm from '../components/admin/ProductForm'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X } from 'lucide-react'
import type { Product } from '../types' // Certifique-se de que o caminho do tipo está correto

// 1. Definição das Props para conectar com o Firebase no App.tsx
interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onExit: () => void;
}

export type Tab = 'dashboard' | 'inventory' | 'reports'
export type AdminModal = 'password' | 'settings' | 'logout' | null

export default function AdminPanel({ products, onAddProduct, onDeleteProduct, onExit }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [activeModal, setActiveModal] = useState<AdminModal>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Função para abrir o formulário (Criação ou Edição)
  const openForm = (product?: Product) => {
    setEditingProduct(product || null)
    setShowForm(true)
  }

  // 2. CORREÇÃO: Esta função agora chama a função do Firebase no App.tsx
  const handleSaveProduct = async (productData: any) => {
    try {
      await onAddProduct(productData);
      setShowForm(false); // Só fecha se o Firebase confirmar o salvamento
      setEditingProduct(null);
    } catch (error) {
      console.error("Erro ao processar salvamento no AdminPanel:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 antialiased">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} openAdminModal={setActiveModal} />
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen pb-24 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[1600px] mx-auto p-0 md:p-4 lg:p-8"
          >
            {activeTab === 'dashboard' && <DashboardView />}
            
            {activeTab === 'inventory' && (
              <Inventory 
                products={products} // Vem do Firebase via App.tsx
                onEdit={openForm} 
                onDelete={onDeleteProduct} // Vem do Firebase via App.tsx
                onAdd={() => openForm()} 
              />
            )}
            
            {activeTab === 'reports' && <Reports />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegação Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} openAdminModal={setActiveModal} />
      </nav>

      {/* --- MODAIS DE ADMINISTRADOR --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600">
                <X size={20} />
              </button>

              {activeModal === 'logout' && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <LogOut size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic">Sair do Sistema?</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 text-xs font-black text-slate-400">Voltar</button>
                    <button onClick={onExit} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl text-xs font-black shadow-xl">Sim, Sair</button>
                  </div>
                </div>
              )}
              {/* ... outros modais (password/settings) podem ser mantidos aqui ... */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Produto - Conectado ao Firebase */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !editingProduct && setShowForm(false)} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
            />
            <ProductForm 
              product={editingProduct} 
              onSave={handleSaveProduct} 
              onClose={() => setShowForm(false)} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}