import React, { useState, useEffect } from 'react';
import {
  Plus, Minus, ShoppingBag, MessageCircle,
  ArrowLeft, MapPin, Loader2, QrCode, CreditCard,
  Banknote, CheckCircle2, Store, Copy, X,
  ChevronRight, User, PackageCheck, Truck
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CartItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  clearCart: () => void;
}

type Step = 'cart' | 'checkout' | 'pix_screen' | 'success';
type PaymentMethod = 'pix' | 'cartao_entrega' | 'dinheiro';

export const CartDrawer = ({ isOpen, onClose, items, total, onUpdate, onRemove, clearCart }: Props) => {
  const [step, setStep] = useState<Step>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'balcao' | 'motoboy'>('balcao');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const DELIVERY_FEE = 6.00;
  const deliveryFeeValue = deliveryType === 'motoboy' ? DELIVERY_FEE : 0;
  const finalTotal = total + deliveryFeeValue;

  // Carregar dados salvos
  useEffect(() => {
    const savedName = localStorage.getItem('@solucell:name');
    const savedPhone = localStorage.getItem('@solucell:phone');
    const savedAddress = localStorage.getItem('@solucell:address');
    if (savedName) setCustomerName(savedName);
    if (savedPhone) setCustomerPhone(savedPhone);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // Máscara de Telefone
  const handlePhoneChange = (v: string) => {
    const x = v.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    if (!x) return;
    setCustomerPhone(!x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`);
  };

  const generatePixCode = () => {
    const pixKey = "5531998381097";
    const amount = finalTotal.toFixed(2);
    return `00020101021226770014br.gov.bcb.pix0114${pixKey}520400005303986540${amount.length}${amount}5802BR5908SOLUCELL6009BELOHORIZONTE62070503***63041D3D`;
  };

  const copyToClipboard = async () => {
    const text = generatePixCode();

    try {
      // Tenta o método moderno
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Método antigo (fallback) para navegadores sem HTTPS ou antigos
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
      alert("Não foi possível copiar automaticamente. Por favor, tire um print do QR Code.");
    }
  };

const handleCheckout = async () => {
    if (!customerName.trim() || customerPhone.length < 14) {
      setStep('checkout');
      return alert("Preencha seu nome e WhatsApp corretamente.");
    }
    if (deliveryType === 'motoboy' && !address.trim()) return alert("O endereço é obrigatório.");

    setIsSubmitting(true);
    try {
      localStorage.setItem('@solucell:name', customerName);
      localStorage.setItem('@solucell:phone', customerPhone);
      localStorage.setItem('@solucell:address', address);

      // 1. SALVANDO NO BANCO (Para aparecer no Dashboard)
      const orderData = {
        customer: customerName.toUpperCase(),
        phone: customerPhone,
        items: items.map(i => ({ 
          name: i.name, 
          quantity: i.quantity, 
          price: i.price,
          image: i.image // <-- AQUI SALVA A IMAGEM NO FIREBASE
        })),
        subtotal: total,
        deliveryFee: deliveryFeeValue,
        total: finalTotal,
        payment: paymentMethod,
        deliveryType,
        address: deliveryType === 'motoboy' ? address : 'Retirada na Loja',
        status: 'pendente',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = docRef.id.slice(-5).toUpperCase();
      const finalOrder = { ...orderData, orderId, date: new Date().toLocaleString() };

      setLastOrder(finalOrder);
      
      // 2. MONTANDO A MENSAGEM PARA O WHATSAPP (Com link da imagem)
      const itemsList = items.map(i => 
        `• ${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})\n  🖼️ Foto: ${i.image || 'Sem foto'}`
      ).join('\n\n');

      const msg = `*🚀 NOVO PEDIDO #${orderId}*\n\n` +
                  `*Cliente:* ${customerName}\n` +
                  `*Telefone:* ${customerPhone}\n\n` +
                  `*Itens:*\n${itemsList}\n\n` +
                  `*TOTAL:* R$ ${finalTotal.toFixed(2)}\n\n` +
                  `*Pagamento:* ${paymentMethod.toUpperCase()}\n` +
                  `*Entrega:* ${deliveryType.toUpperCase()}\n` +
                  `${deliveryType === 'motoboy' ? `*Endereço:* ${address}` : ''}`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5531975413394&text=${encodeURIComponent(msg)}`;

      setTimeout(() => {
        setStep('success');
        clearCart();
        setIsSubmitting(false);
        if (paymentMethod !== 'pix') window.open(whatsappUrl, '_blank');
      }, 800);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar pedido.");
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    onClose();
    setTimeout(() => setStep('cart'), 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER COMPACTO */}
        <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button onClick={() => setStep('cart')} className="p-1 text-slate-600">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-base font-black text-slate-900 uppercase italic tracking-tighter">
              {step === 'success' ? 'Pedido Confirmado' : step === 'checkout' ? 'Check-out' : 'Minha Sacola'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-rose-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide">

          {/* LISTA DE ITENS */}
          {step === 'cart' && (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Sua sacola está vazia</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 items-center">
                    <img src={item.image} className="w-14 h-14 object-contain rounded-lg bg-slate-50" alt={item.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-black text-slate-700 uppercase truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-indigo-600 font-black text-sm">R$ {item.price.toFixed(2)}</p>
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                          <button onClick={() => onUpdate(item.id, -1)} className="w-6 h-6 flex items-center justify-center"><Minus size={12} /></button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdate(item.id, 1)} className="w-6 h-6 flex items-center justify-center"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 'checkout' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                  <User size={14} /> Seus Dados
                </label>
                <input type="text" placeholder="Nome Completo" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-base font-bold border-0 focus:ring-2 focus:ring-indigo-500" />
                <input type="tel" placeholder="WhatsApp" value={customerPhone} onChange={e => handlePhoneChange(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-base font-bold border-0 focus:ring-2 focus:ring-indigo-500" />
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                  <Truck size={14} /> Entrega
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDeliveryType('balcao')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${deliveryType === 'balcao' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 text-slate-400 bg-slate-50'}`}>
                    <Store size={20} /> <span className="text-[10px] font-black uppercase">Retirar</span>
                  </button>
                  <button onClick={() => setDeliveryType('motoboy')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${deliveryType === 'motoboy' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 text-slate-400 bg-slate-50'}`}>
                    <MapPin size={20} /> <span className="text-[10px] font-black uppercase">Entrega</span>
                  </button>
                </div>
                {deliveryType === 'motoboy' && (
                  <textarea placeholder="Endereço (Rua, Nº, Bairro)..." value={address} onChange={e => setAddress(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold border-0 h-20 focus:ring-2 focus:ring-indigo-500" />
                )}
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                  <CreditCard size={14} /> Pagamento
                </label>
                <div className="space-y-2">
                  {['pix', 'cartao_entrega', 'dinheiro'].map((m) => (
                    <button key={m} onClick={() => setPaymentMethod(m as PaymentMethod)} className={`w-full p-4 rounded-xl border flex items-center justify-between ${paymentMethod === m ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                      <span className="text-[10px] font-black uppercase tracking-tight">{m.replace('_', ' ')}</span>
                      {paymentMethod === m && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TELA PIX */}
          {step === 'pix_screen' && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
              <div className="bg-white p-4 inline-block rounded-2xl border border-slate-100 shadow-xl">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generatePixCode())}`} className="w-40 h-40" alt="QR PIX" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase">Total a Pagar</p>
                <h3 className="font-black text-4xl text-slate-900 tracking-tighter">R$ {finalTotal.toFixed(2)}</h3>
              </div>
              <button onClick={copyToClipboard} className={`w-full py-5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />} {copied ? 'Copiado!' : 'Copiar Código Pix'}
              </button>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Após copiar, clique em finalizar abaixo.</p>
            </div>
          )}

          {/* SUCESSO */}
          {step === 'success' && lastOrder && (
            <div className="space-y-6 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <PackageCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Pedido Recebido!</h3>

              <div className="bg-slate-900 rounded-2xl p-6 text-left space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Resumo #{lastOrder.orderId}</span>
                  <span className="text-[8px] text-white/30 uppercase">{lastOrder.date}</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {lastOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-[10px] text-white/80 font-bold">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-indigo-400 font-black">
                  <span className="text-[10px] uppercase italic">Total Pago</span>
                  <span className="text-xl">R$ {lastOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button onClick={() => window.open(`https://wa.me/5531975413394?text=Olá! Pedido #${lastOrder.orderId}`, '_blank')} className="w-full py-5 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg">
                  <MessageCircle size={18} fill="currentColor" /> Enviar no WhatsApp
                </button>
                <button onClick={handleCloseSuccess} className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Fechar Sacola
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER FIXO */}
        {step !== 'success' && items.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Total</p>
                <p className="text-3xl font-black text-slate-900 leading-none">R$ {finalTotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">
                  {deliveryType === 'motoboy' ? `Entrega: R$${DELIVERY_FEE.toFixed(2)}` : 'Retirada: Grátis'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (step === 'cart') setStep('checkout');
                else if (step === 'checkout') paymentMethod === 'pix' ? setStep('pix_screen') : handleCheckout();
                else if (step === 'pix_screen') handleCheckout();
              }}
              disabled={isSubmitting}
              className="w-full h-14 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {step === 'cart' ? 'Finalizar Compra' : 'Confirmar Pedido'}
                  <ChevronRight size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};