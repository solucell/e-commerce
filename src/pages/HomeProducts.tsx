import React, { useState } from 'react';
import { Search, ChevronRight, ArrowLeft, Filter, ArrowUpDown, Zap } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import type { Product, Category } from '../types';

interface HomeProductsProps {
  products: Product[];
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  loading?: boolean; // Nova prop para feedback visual
}

const HomeProducts = ({
  products = [],
  categories = [],
  searchTerm,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onOpenDetails,
  loading = false
}: HomeProductsProps) => {
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');

  // 1. Normalização e Filtro de Busca
  const term = searchTerm.toLowerCase().trim();
  const searchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(term) || 
    p.category?.toLowerCase().includes(term)
  );

  // 2. Lógica de Categorização Robusta
  const isProductInCat = (p: Product, catId: string) => {
    if (!catId || catId === 'all') return true;
    const prodCat = String(p.category || '').toLowerCase().trim();
    const targetCatId = String(catId).toLowerCase().trim();
    const catName = categories.find(c => c.id.toLowerCase().trim() === targetCatId)?.name?.toLowerCase().trim();
    return prodCat === targetCatId || (catName && prodCat === catName);
  };

  // 3. Lógica de Ordenação
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  // Estado: Carregando (Skeleton)
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-[350px] bg-slate-100 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  // Estado: Sem resultados
  if (searchedProducts.length === 0 && products.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search className="text-slate-300" size={40} strokeWidth={1} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Nenhum resultado</h3>
        <p className="text-slate-400 text-sm mt-2">
          Não encontramos nada para <span className="text-indigo-600 font-bold italic">"{searchTerm}"</span>
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest"
        >
          Limpar Filtros
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 md:space-y-16 p-4 pb-20">
      
      {/* TOOLBAR DE FILTROS (Apenas quando uma categoria está selecionada) */}
      {selectedCategory !== 'all' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div>
            <button 
              onClick={() => onSelectCategory('all')}
              className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft size={14} /> Voltar ao Início
            </button>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
              {sortedProducts.filter(p => isProductInCat(p, selectedCategory)).length} Produtos Disponíveis
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none cursor-pointer text-slate-600"
            >
              <option value="default">Ordenar por</option>
              <option value="priceAsc">Menor Preço</option>
              <option value="priceDesc">Maior Preço</option>
            </select>
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
              <ArrowUpDown size={14} />
            </div>
          </div>
        </div>
      )}

      {selectedCategory === 'all' ? (
        categories.map((cat, idx) => {
          const catProducts = sortedProducts.filter(p => isProductInCat(p, cat.id));
          if (catProducts.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Zap size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Destaques</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{cat.name}</h2>
                </div>
                
                <button 
                  onClick={() => onSelectCategory(cat.id)}
                  className="bg-slate-50 hover:bg-slate-900 hover:text-white transition-all p-3 md:px-6 md:py-3 rounded-2xl flex items-center gap-3 group"
                >
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Explorar Categoria</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {catProducts.slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onOpenDetails={onOpenDetails}
                  />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        /* GRID COMPLETO DA CATEGORIA FILTRADA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts
            .filter(p => isProductInCat(p, selectedCategory))
            .map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenDetails={onOpenDetails}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default HomeProducts;