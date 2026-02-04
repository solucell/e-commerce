import React, { useState, useEffect, useRef } from 'react'
import { X, Save, Camera, ChevronDown, Package, Loader2 } from 'lucide-react'
import { uploadToCloudinary } from '../../services/uploadService'
import type { Product } from '../../types'
import { CATEGORIES_DATA } from '../../constants/categories';

interface ProductExtended extends Product {
  description?: string
  tag?: string
  connectors?: string[]
}

interface ProductFormProps {
  product: Product | null
  onSave: (product: any) => Promise<void>
  onClose: () => void
}

export default function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [formData, setFormData] = useState<ProductExtended>({
    id: '', name: '', nameLower: '', category: 'Celulares', price: 0, stock: 0,
    image: '', description: '', tag: '', connectors: []
  })

  const statusTags = ['Lançamento', 'Promoção', 'Usado', 'Mais Vendido']
  const connectorOptions = ['V8', 'Tipo-C', 'iPhone (Lightning)']

  useEffect(() => {
    if (product) {
      setFormData({ 
        ...product, 
        description: (product as any).description || '',
        tag: (product as any).tag || '',
        connectors: (product as any).connectors || [],
        nameLower: product.name ? product.name.toLowerCase() : ''
      })
    }
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image && !imageFile) {
      alert("Selecione uma imagem!")
      return
    }

    setLoading(true)
    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile)
      }

      await onSave({ 
        ...formData, 
        image: finalImageUrl,
        price: Number(formData.price),
        stock: Number(formData.stock),
        nameLower: formData.name.toLowerCase()
      })
      onClose()
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[110] p-0 sm:p-4">
      <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase">
              {product ? 'Editar Produto' : 'Novo Produto'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Foto */}
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div 
                onClick={() => !loading && fileInputRef.current?.click()}
                className="relative w-24 h-24 shrink-0 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {previewUrl || formData.image ? (
                  <img src={previewUrl || formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-300" />
                )}
                {loading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase">Foto Principal *</h4>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-indigo-600 uppercase">
                  {formData.image ? 'Trocar' : 'Selecionar'}
                </button>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Produto *</label>
              <input
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold"
              />
            </div>

            {/* Categoria - USANDO CATEGORIES_DATA */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Principal *</label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none focus:border-indigo-500"
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES_DATA.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço *</label>
                <input
                  type="number" step="0.01" required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estoque *</label>
                <input
                  type="number" required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição *</label>
              <textarea
                required rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>
          </form>
        </div>

        <div className="p-6 bg-white border-t border-slate-50">
          <button
            form="product-form"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="text-indigo-400" />}
            {loading ? 'Processando...' : 'Salvar no Firestore'}
          </button>
        </div>
      </div>
    </div>
  )
}