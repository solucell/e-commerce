import React, { useState } from 'react'
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'

interface LoginProps {
  onLogin: (status: boolean) => void
}

export default function LoginAdmin({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulação de autenticação (Substitua pela sua lógica de Firebase/API)
    setTimeout(() => {
      if (email === 'solucell@solucell.com' && password === 'Solucell2026') {
        onLogin(true)
      } else {
        alert('Credenciais inválidas!')
      }
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-indigo-100 border border-slate-100 mb-6 animate-bounce-slow">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
            Solu<span className="text-indigo-600 italic">Cell</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
            Painel de Controle Restrito
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/60 border border-white relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@solucell.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha Secreta</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Acessar Sistema
                  <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer do Card */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-400 font-medium">
              Esqueceu o acesso? Contate o suporte técnico SoluCell.
            </p>
          </div>
        </div>

        {/* Link para voltar à loja */}
        <div className="text-center mt-8">
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
            ← Voltar para a Loja Pública
          </button>
        </div>
      </div>
    </div>
  )
}