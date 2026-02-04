import React, { useState, useMemo } from 'react'
import { 
  Search, Plus, Edit3, Trash2, Box, Package, 
  Download, AlertTriangle, DollarSign, Layers
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Tipagens ---
interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  image: string
}

interface InventoryProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function Inventory({ products, onEdit, onDelete, onAdd }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const categories = [
    'Todos', 'Celulares', 'Cases', 'Carregadores', 'Fones', 
    'Garrafas', 'Smartwatches', 'Cabos', 'Outros'
  ]

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [products, searchTerm, selectedCategory])

  const stats = useMemo(() => ({
    totalItems: products.reduce((acc, p) => acc + p.stock, 0),
    lowStock: products.filter(p => p.stock < 5).length,
    inventoryValue: products.reduce((acc, p) => acc + (p.stock * p.price), 0)
  }), [products])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-100 relative">
      
      <div className="relative max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Inventory</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Layers size={20} className="md:w-6 md:h-6" />
               </div>
               <h1 className="text-2xl md:text-5xl font-black tracking-tight text-slate-900">
                  Estoque<span className="text-indigo-600">.</span>
               </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 md:flex-none h-11 md:h-14 px-4 bg-white border border-slate-200 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <Download size={14} className="text-slate-400" /> Exportar
            </button>
            <button 
              onClick={onAdd}
              className="flex-[1.5] md:flex-none h-11 md:h-14 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Novo Item
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard icon={<Package />} label="SKUs" value={products.length} gradient="from-indigo-500 to-indigo-700" />
          <MetricCard icon={<Box />} label="Peças" value={stats.totalItems} gradient="from-blue-500 to-blue-700" />
          <MetricCard icon={<AlertTriangle />} label="Crítico" value={stats.lowStock} gradient="from-rose-500 to-rose-700" isAlert={stats.lowStock > 0} />
          <MetricCard icon={<DollarSign />} label="Valor" value={`R$ ${Math.floor(stats.inventoryValue/1000)}k`} gradient="from-emerald-500 to-emerald-700" />
        </section>

        <section className="space-y-4">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium shadow-sm outline-none focus:border-indigo-500/30 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-slate-400 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Produto</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qtd</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preço</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id || `row-${index}`} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-10 h-10 rounded-lg bg-slate-50 object-contain p-1 border" alt="" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm uppercase leading-tight">{product.name}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                       <span className={`text-xs font-black ${product.stock < 5 ? 'text-rose-500' : 'text-slate-600'}`}>{product.stock} UN</span>
                    </td>
                    <td className="px-8 py-4 text-right font-black text-slate-900 text-sm">
                      R$ {product.price.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProducts.map((product, index) => (
              <div key={product.id || `mob-${index}`} className="p-3 flex items-center gap-3 active:bg-slate-50">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center">
                    <img src={product.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  {product.stock < 5 && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-[10px] uppercase truncate tracking-tight">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{product.category}</span>
                    <span className={`text-[9px] font-black ${product.stock < 5 ? 'text-rose-500' : 'text-slate-500'}`}>
                      • {product.stock} un
                    </span>
                  </div>
                  <p className="text-[11px] font-black text-slate-900 mt-0.5">R$ {product.price.toLocaleString('pt-BR')}</p>
                </div>

                <div className="flex gap-1.5">
                   <button onClick={() => onEdit(product)} className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg active:scale-90 transition-all"><Edit3 size={14}/></button>
                   <button onClick={() => setDeleteConfirm(product.id)} className="w-8 h-8 flex items-center justify-center text-rose-300 bg-rose-50 rounded-lg active:scale-90 transition-all"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 md:p-10 shadow-2xl text-center">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Remover Item?</h3>
              <p className="text-slate-400 text-[9px] mt-2 mb-6 font-bold uppercase tracking-widest leading-relaxed">
                Ação irreversível no catálogo SoluCell.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-xl border border-slate-100">Cancelar</button>
                <button onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 h-11 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-100">Excluir</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetricCard({ icon, label, value, gradient, isAlert }: any) {
  return (
    <div className={`bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group ${isAlert ? 'ring-1 ring-rose-500/20' : ''}`}>
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}>
          {React.cloneElement(icon as React.ReactElement, { size: 14, strokeWidth: 3 } as any)}
        </div>
        <div className="min-w-0">
          <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</p>
          <p className="text-xs md:text-xl font-black text-slate-900 tracking-tighter truncate leading-none">{value}</p>
        </div>
      </div>
    </div>
  )
}