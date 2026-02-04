import type { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'capas', name: 'Capas e Películas', icon: '🛡️' },
  { id: 'cabos', name: 'Cabos e Carregadores', icon: '🔌' },
  { id: 'fones', name: 'Fones de Ouvido', icon: '🎧' },
  { id: 'baterias', name: 'Baterias', icon: '🔋' },
  { id: 'pecas', name: 'Peças', icon: '🔧' },
  { id: 'servicos', name: 'Serviços Rápidos', icon: '⚡' },
];

export const products: Product[] = [
  { id: '1', name: 'Película de Vidro 3D', description: 'Proteção completa borda a borda com resistência 9H', price: 25.00, category: 'capas', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Mais Vendido', rating: 4.8 },
  { id: '4', name: 'Carregador Turbo 20W', description: 'Carregamento rápido certificado, compatível com todos os modelos', price: 45.00, category: 'cabos', image: 'https://images.pexels.com/photos/4792087/pexels-photo-4792087.jpeg?auto=compress&cs=tinysrgb&w=400', badge: 'Novidade', rating: 4.9 },
  // ... adicione os outros produtos aqui seguindo o mesmo padrão
];