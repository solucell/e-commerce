export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}