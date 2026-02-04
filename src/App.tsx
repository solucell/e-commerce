import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import { CATEGORIES_DATA } from './constants/categories';

// Componentes
import { Header } from './components/Header';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersDrawer } from './components/OrdersDrawer';
import AdminPanel from './pages/AdminPanel';
import LoginAdmin from './pages/LoginAdmin';
import HomeProducts from './pages/HomeProducts';
import Footer from './components/Footer';
import { Toast } from './components/Toast';

// Hooks e Tipos
import { MOCK_PRODUCTS } from './data/mockData';
import { useCart } from './hooks/useCart';
import type { Product } from './types';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('@solucell:auth') === 'true';
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // 1. PERSISTÊNCIA DE CATEGORIA E BUSCA
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('@solucell:last_category') || 'all';
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. PERSISTÊNCIA DOS DRAWERS (Carrinho e Pedidos)
  const [isCartOpen, setIsCartOpen] = useState(() => {
    return localStorage.getItem('@solucell:cart_open') === 'true';
  });
  const [isOrdersOpen, setIsOrdersOpen] = useState(() => {
    return localStorage.getItem('@solucell:orders_open') === 'true';
  });
  
  const [showToast, setShowToast] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  // --- EFEITOS DE SINCRONIZAÇÃO COM LOCALSTORAGE ---
  
  useEffect(() => {
    localStorage.setItem('@solucell:last_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('@solucell:cart_open', isCartOpen.toString());
  }, [isCartOpen]);

  useEffect(() => {
    localStorage.setItem('@solucell:orders_open', isOrdersOpen.toString());
  }, [isOrdersOpen]);

  // --- FIREBASE PRODUCTS ---
  useEffect(() => {
    try {
      const q = query(collection(db, 'products'), orderBy('name', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Product[];
        setAllProducts(productsData);
      }, (error) => {
        console.warn("Firebase offline ou sem permissão.");
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Erro ao conectar ao Firestore:", e);
    }
  }, []);

  // Verificar se é Admin via URL
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdminMode(true);
    }
  }, []);

  // --- HANDLERS ---
  const handleLoginSuccess = (status: boolean) => {
    if (status) {
      setIsAuthenticated(true);
      sessionStorage.setItem('@solucell:auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    setIsAuthenticated(false);
    sessionStorage.removeItem('@solucell:auth');
  };

  const handleSaveProduct = async (p: any) => {
    try {
      const productData = {
        ...p,
        nameLower: p.name.toLowerCase(),
        updatedAt: new Date().toISOString()
      };
      if (p.id) {
        await updateDoc(doc(db, 'products', p.id), productData);
      } else {
        productData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'products'), productData);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try { await deleteDoc(doc(db, 'products', id)); } catch (e) { console.error(e); }
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // --- RENDERS ADMIN ---
  if (isAdminMode && !isAuthenticated) {
    return <LoginAdmin onLogin={handleLoginSuccess} onBack={() => setIsAdminMode(false)} />;
  }

  if (isAdminMode && isAuthenticated) {
    return (
      <AdminPanel
        products={allProducts.length > 0 ? allProducts : MOCK_PRODUCTS}
        onAddProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onExit={handleLogout}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
        <Toast show={showToast} message="Adicionado ao carrinho!" />

        <Header
          onSearch={setSearchTerm}
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrders={() => setIsOrdersOpen(true)}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 pb-32">
          <HomeProducts
            products={allProducts.length > 0 ? allProducts : MOCK_PRODUCTS}
            categories={CATEGORIES_DATA}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onOpenDetails={setSelectedProduct}
          />
        </main>

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Carrinho com persistência interna */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          total={cartTotal}
          onUpdate={updateQuantity}
          onRemove={removeFromCart}
          clearCart={clearCart}
        />

        <OrdersDrawer 
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
        />

      </div>
      <Footer />
    </>
  );
}