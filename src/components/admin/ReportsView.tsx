import React, { useState, useMemo, useEffect } from 'react'
import { 
  CheckCircle, Clock, XCircle, Package, Download, 
  Search, FileText, TrendingUp, 
  ArrowUpRight, ArrowDownRight, DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Firebase
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'

type TransactionStatus = 'completed' | 'pending' | 'processing' | 'cancelled';

interface Transaction {
  id: string;
  customer: string;
  product: string; 
  amount: number; 
  status: TransactionStatus; 
  date: string; 
  payment: string;
  timestamp: any;
}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [periodFilter, setPeriodFilter] = useState<'today' | 'month' | 'year'>('month')
  
  // ESTADO PARA DADOS REAIS
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // --- BUSCA DADOS REAIS DO FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const payload = doc.data();
        // Mapeia os produtos para uma string única
        const productList = payload.items?.map((i: any) => i.name).join(', ') || 'Sem produto';
        
        return {
          id: doc.id.slice(-5).toUpperCase(),
          customer: payload.customer || 'Cliente Anonimo',
          product: productList,
          amount: payload.total || 0,
          status: payload.status === 'finalizado' ? 'completed' : 
                  payload.status === 'rota' ? 'processing' : 'pending',
          date: payload.createdAt?.toDate().toLocaleDateString('pt-BR') || '',
          payment: payload.payment || 'N/A',
          timestamp: payload.createdAt?.toDate()
        } as Transaction;
      });
      
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm.toUpperCase())
      
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      
      // Lógica de período real
      const now = new Date();
      const tDate = t.timestamp;
      let matchesPeriod = true;

      if (periodFilter === 'today' && tDate) {
        matchesPeriod = tDate.toDateString() === now.toDateString();
      } else if (periodFilter === 'month' && tDate) {
        matchesPeriod = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesPeriod
    })
  }, [searchTerm, statusFilter, periodFilter, transactions])

  // --- CÁLCULOS DE MÉTRICAS REAIS ---
  const stats = useMemo(() => {
    const completed = filteredTransactions.filter(t => t.status === 'completed')
    const totalRevenue = completed.reduce((acc, t) => acc + t.amount, 0)
    const ticketMedio = completed.length > 0 ? totalRevenue / completed.length : 0
    const cancelados = filteredTransactions.filter(t => t.status === 'cancelled').reduce((acc, t) => acc + t.amount, 0)

    return {
      revenue: totalRevenue,
      count: completed.length,
      average: ticketMedio,
      lost: cancelados
    }
  }, [filteredTransactions])

  // --- EXPORTAR PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Relatório de Vendas - SoluCell", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    const tableRows = filteredTransactions.map(t => [
      `#${t.id}`,
      t.customer.toUpperCase(),
      t.product,
      `R$ ${t.amount.toLocaleString('pt-BR')}`,
      t.payment,
      t.date,
      t.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'CLIENTE', 'PRODUTOS', 'VALOR', 'PGTO', 'DATA', 'STATUS']],
      body: tableRows,
      headStyles: { fillColor: [15, 23, 42] },
    });

    doc.save(`relatorio-solucell-${Date.now()}.pdf`);
  };

  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': return { label: 'Concluído', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' }
      case 'pending': return { label: 'Pendente', icon: Clock, color: 'text-amber-500 bg-amber-50' }
      case 'processing': return { label: 'Em Rota', icon: Package, color: 'text-indigo-500 bg-indigo-50' }
      case 'cancelled': return { label: 'Cancelado', icon: XCircle, color: 'text-rose-500 bg-rose-50' }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-10">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dados Consolidados</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FileText size={24} />
               </div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Relatórios<span className="text-indigo-600">.</span></h1>
            </div>
          </div>

          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {(['today', 'month', 'year'] as const).map((p) => (
              <button key={p} onClick={() => setPeriodFilter(p)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${periodFilter === p ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>
                {p === 'today' ? 'Hoje' : p === 'month' ? 'Mês' : 'Ano'}
              </button>
            ))}
          </div>
        </header>

        {/* METRICAS REAIS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard icon={<DollarSign />} label="Faturamento" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenue)} gradient="from-emerald-500 to-emerald-700" />
          <MetricCard icon={<TrendingUp />} label="Ticket Médio" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.average)} gradient="from-indigo-500 to-indigo-700" />
          <MetricCard icon={<ArrowUpRight />} label="Vendas Concluídas" value={stats.count} gradient="from-blue-500 to-blue-700" />
          <MetricCard icon={<ArrowDownRight />} label="Cancelados" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.lost)} gradient="from-rose-500 to-rose-700" />
        </section>

        {/* FILTROS E BUSCA */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por cliente, produto ou ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium shadow-sm outline-none focus:border-indigo-500" />
          </div>
          
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-12 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer">
            <option value="all">Todos os Status</option>
            <option value="completed">Concluídos</option>
            <option value="pending">Pendentes</option>
            <option value="processing">Em Rota</option>
            <option value="cancelled">Cancelados</option>
          </select>

          <button onClick={handleExportPDF} className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all active:scale-95">
            <Download size={16} /> Exportar PDF
          </button>
        </div>

        {/* TABELA DE DADOS */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Carregando dados...</div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente / Produtos</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map(t => {
                    const status = getStatusConfig(t.status)
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 text-indigo-600 font-black text-xs">#{t.id}</td>
                        <td className="px-8 py-5">
                          <p className="font-black text-slate-800 uppercase text-xs mb-1">{t.customer}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-xs">{t.product} • {t.date}</p>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">R$ {t.amount.toLocaleString('pt-BR')}</td>
                        <td className="px-8 py-5 text-right">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${status?.color}`}>
                            {status?.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center text-slate-400 font-black text-xs uppercase tracking-widest">Nenhum dado encontrado para os filtros selecionados</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reutilizando o MetricCard
function MetricCard({ icon, label, value, gradient }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 3 } as any)}
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-black text-slate-900 tracking-tighter leading-none mt-1">{value}</p>
        </div>
      </div>
    </div>
  )
}