/**
 * Interface principal de Produto
 * Reflete a estrutura salva na coleção 'products' do Firebase
 */
export interface Product {
  id: string;
  name: string;
  nameLower: string;   // Crucial para buscas no Firestore: product.name.toLowerCase()
  price: number;
  stock: number;
  category: string;    // Deve bater com o 'name' da interface Category
  image: string;       // URL pública da imagem (Firebase Storage ou externa)
  description?: string;
  badge?: string;      // Ex: "Novo", "Oferta", "-20%"
  updatedAt?: string;  // ISO String: new Date().toISOString()
  createdAt?: string;
}

/**
 * Interface de Item do Carrinho
 * Extende Product para garantir que todas as infos (incluindo image) 
 * estejam disponíveis durante o checkout.
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Interface de Categoria
 * Usada para renderizar os filtros e menus da loja
 */
export interface Category {
  id: string;
  name: string;
  icon: string; // Nome do ícone da Lucide ou URL
}

/**
 * Interface de Pedido (Order)
 * Esta é a estrutura que você deve salvar na coleção 'orders'
 * Repare que o 'OrderItem' é uma versão simplificada para histórico
 */
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string; // Salvar a imagem aqui garante que o histórico de pedidos nunca fique vazio
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  email?: string;
  items: OrderItem[];
  total: number;
  type: 'balcao' | 'motoboy';
  status: 'pendente' | 'rota' | 'finalizado';
  paymentMethod: string;
  isPaid: boolean;
  address?: string;      // Obrigatório se type for 'motoboy'
  deliveryFee?: number;
  createdAt: any;        // Timestamp do Firebase
}