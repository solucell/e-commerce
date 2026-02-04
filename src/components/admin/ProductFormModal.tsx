import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Save } from 'lucide-react';
import { ProductForm } from './ProductForm';

export const ProductFormModal = ({ product, onClose, onSave }: any) => {
  const isEditing = !!product;
  
  // Estado inicial do formulário
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'celulares',
    image: '',
    stock: '0',
    badge: ''
  });

  // Se estiver editando, preenche os campos com os dados do produto
  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: product.price.toString(),
        stock: product.stock.toString()
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: product?.id || Date.now().toString(), // Gera ID se for novo
      price: parseFloat(form.price),
      stock: parseInt(form.stock)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER DO MODAL */}
        <div className="p-8 flex justify-between items-start border-b border-slate-800/50 bg-slate-900/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <PackagePlus size={24} />
            </div>
            <div>
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {isEditing ? 'Gestão de Item' : 'Novo Registro'}
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                {isEditing ? 'Editar Produto' : 'Adicionar ao Estoque'}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div className="p-8">
          <ProductForm 
            form={form} 
            setForm={setForm} 
            onSubmit={handleSubmit} 
            onCancel={onClose} 
            isEditing={isEditing} 
          />
        </div>
      </div>
    </div>
  );
};