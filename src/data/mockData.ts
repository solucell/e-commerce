import type { Category, Product } from "../types";

export const MOCK_CATEGORIES: Category[] = [
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'fones', name: 'Fones de Ouvido', icon: '🎧' },
  { id: 'acessorios', name: 'Acessórios', icon: '🔌' }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- SMARTPHONES ---
  {
    id: 's1',
    name: 'iPhone 15 Pro Max - 256GB',
    price: 8499,
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80',
    stock: 8,
    nameLower: 'iphone 15 pro max'
  },
  {
    id: 's2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 7299,
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1707230503013-ec84606b251a?w=500&q=80',
    stock: 5,
    nameLower: 'samsung galaxy s24 ultra'
  },
  {
    id: 's3',
    name: 'iPhone 13 - 128GB',
    price: 3899,
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1633110385270-471afba00214?w=500&q=80',
    stock: 12,
    nameLower: 'iphone 13'
  },

  // --- FONES DE OUVIDO ---
  {
    id: 'f1',
    name: 'AirPods Pro (2ª Geração)',
    price: 1899,
    category: 'fones',
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&q=80',
    stock: 15,
    nameLower: 'airpods pro'
  },
  {
    id: 'f2',
    name: 'Sony WH-1000XM5 ANC',
    price: 2499,
    category: 'fones',
    image: 'https://images.unsplash.com/photo-1644737554464-327ce4484bd7?w=500&q=80',
    stock: 4,
    nameLower: 'sony wh-1000xm5'
  },
  {
    id: 'f3',
    name: 'Galaxy Buds2 Pro',
    price: 899,
    category: 'fones',
    image: 'https://images.unsplash.com/photo-1655560373235-21919af68f63?w=500&q=80',
    stock: 20,
    nameLower: 'galaxy buds2 pro'
  },

  // --- ACESSÓRIOS ---
  {
    id: 'a1',
    name: 'Capa MagSafe iPhone Silicon',
    price: 149,
    category: 'acessorios',
    image: 'https://images.unsplash.com/photo-1603313011101-31c726a82786?w=500&q=80',
    stock: 50,
    nameLower: 'capa magsafe'
  },
  {
    id: 'a2',
    name: 'Carregador 20W USB-C',
    price: 199,
    category: 'acessorios',
    image: 'https://images.unsplash.com/photo-1625850449429-3d7bd496227b?w=500&q=80',
    stock: 30,
    nameLower: 'carregador 20w usb-c'
  },
  {
    id: 'a3',
    name: 'Apple Watch Series 9',
    price: 3299,
    category: 'acessorios',
    image: 'https://images.unsplash.com/photo-1434493907317-a46b5bc78344?w=500&q=80',
    stock: 6,
    nameLower: 'apple watch series 9'
  },
  {
    id: 'a4',
    name: 'Cabo Lightning 1m Original',
    price: 99,
    category: 'acessorios',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d715b909?w=500&q=80',
    stock: 100,
    nameLower: 'cabo lightning'
  }
];