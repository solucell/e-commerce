import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, Search, Truck, LayoutGrid, Menu, X, 
    ChevronRight, Phone, Instagram, MapPin, MessageCircle,
    PackageSearch, ClipboardList
} from 'lucide-react';
import { CATEGORIES_DATA } from '../constants/categories';

interface Props {
    onSearch: (val: string) => void;
    cartCount: number;
    onOpenCart: () => void;
    activeCategory: string;
    onSelectCategory: (id: string) => void;
    onOpenOrders?: () => void; // Nova prop para abrir o histórico
}

export const Header = ({
    onSearch,
    cartCount,
    onOpenCart,
    activeCategory,
    onSelectCategory,
    onOpenOrders
}: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hasRecentOrder, setHasRecentOrder] = useState(false);

    const allCategories = [
        { id: 'all', name: 'Todos', icon: <LayoutGrid size={18} /> }, 
        ...CATEGORIES_DATA 
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        // Verifica se existe um pedido no histórico local para mostrar um badge
        const lastOrder = localStorage.getItem('@solucell:last_order');
        if (lastOrder) setHasRecentOrder(true);

        if (isMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    return (
        <div className="flex flex-col w-full sticky top-0 z-[100]">

            {/* 1. UTILITY BAR */}
            <div className="bg-slate-950 text-slate-400 py-1.5 px-4 hidden md:flex justify-between items-center text-[10px] font-medium border-b border-white/5">
                <div className="flex items-center gap-6">
                    <a href="https://wa.me/5531975413394" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                        <MessageCircle size={12} className="text-emerald-500" />
                        Suporte WhatsApp
                    </a>
                    <span className="flex items-center gap-2">
                        <MapPin size={12} /> Vespasiano e BH
                    </span>
                </div>
                
                {/* NOVO: Link de Meus Pedidos no Topo (Desktop) */}
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onOpenOrders}
                        className="flex items-center gap-2 hover:text-white transition-colors text-indigo-400 font-bold uppercase tracking-tighter"
                    >
                        <PackageSearch size={14} />
                        Rastrear Meus Pedidos
                    </button>
                    <a href="#" className="hover:text-pink-500 transition-colors">
                        <Instagram size={14} />
                    </a>
                </div>
            </div>

            {/* 2. TOP BAR DE VANTAGENS */}
            <div className="bg-black text-white py-2 px-4 flex justify-center items-center gap-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 text-indigo-400 shrink-0">
                    <Truck size={12} strokeWidth={3} /> Entrega Rápida em Toda Vespasiano e BH
                </span>
            </div>

            {/* 3. HEADER PRINCIPAL */}
            <header className={`transition-all duration-300 w-full bg-slate-900 border-b border-white/5 ${scrolled ? 'shadow-2xl py-2' : 'py-4'}`}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between gap-6">

                        {/* Botão Menu Mobile */}
                        <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => onSelectCategory('all')}>
                            <img src="/logo-solucell.png" alt="Solucell" className="h-7 md:h-10 w-auto" />
                        </div>

                        {/* Busca (Desktop) */}
                        <div className="hidden md:flex flex-1 max-w-xl relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="O que você procura hoje?"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>

                        {/* Ações: Carrinho e Pedidos (Mobile) */}
                        <div className="flex items-center gap-3">
                            {/* Botão Histórico Mobile */}
                            <button 
                                onClick={onOpenOrders}
                                className="md:hidden relative p-2.5 bg-slate-800 text-slate-300 rounded-xl active:scale-95 transition-all"
                            >
                                <ClipboardList size={22} />
                                {hasRecentOrder && <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />}
                            </button>

                            <button onClick={onOpenCart} className="relative flex items-center justify-center w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg active:scale-95">
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-indigo-900 text-[10px] font-black h-5 w-5 rounded-lg flex items-center justify-center ring-4 ring-slate-900">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 4. NAVEGAÇÃO DE CATEGORIAS (Desktop) */}
                    <nav className="hidden md:flex justify-start gap-2 mt-5 overflow-x-auto no-scrollbar pb-2">
                        {allCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap
                                    ${activeCategory === cat.id
                                        ? 'bg-white text-slate-900 border-white shadow-xl'
                                        : 'bg-slate-800 text-slate-400 border-transparent hover:border-slate-600 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* --- MENU MOBILE SIDEBAR --- */}
                <div className={`fixed inset-0 bg-[#0f172a] z-[200] transition-all duration-500 md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <img src="/logo-solucell.png" alt="Solucell" className="h-8 w-auto" />
                        <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-800/50 rounded-2xl text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                        {/* NOVO: Atalho Rápido para Pedidos no Menu Mobile */}
                        <button 
                            onClick={() => { onOpenOrders?.(); setIsMenuOpen(false); }}
                            className="flex items-center gap-4 w-full p-5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 mb-6"
                        >
                            <PackageSearch size={24} />
                            <div className="text-left">
                                <p className="text-xs font-black uppercase">Meus Pedidos</p>
                                <p className="text-[10px] opacity-70">Acompanhar status e histórico</p>
                            </div>
                        </button>

                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Categorias</p>
                        
                        {allCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { onSelectCategory(cat.id); setIsMenuOpen(false); }}
                                className={`flex items-center justify-between w-full p-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-white text-slate-900 shadow-xl'
                                        : 'bg-slate-800/40 text-slate-400 border border-white/5'
                                }`}
                            >
                                <span className="flex items-center gap-5">
                                    {cat.icon}
                                    {cat.name}
                                </span>
                                <ChevronRight size={16} />
                            </button>
                        ))}
                    </nav>
                </div>
            </header>
        </div>
    );
};