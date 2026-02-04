import { 
  Smartphone, CaseUpper, BatteryCharging, Headphones, 
  GlassWater, Laptop, HardDrive, Watch, 
  Cable, Speaker, Package 
} from 'lucide-react';

export const CATEGORIES_DATA = [
  { id: 'Celulares', name: 'Celulares', icon: <Smartphone size={18} /> },
  { id: 'Cases e Acessórios', name: 'Cases e Acessórios', icon: <CaseUpper size={18} /> },
  { id: 'Carregadores', name: 'Carregadores', icon: <BatteryCharging size={18} /> },
  { id: 'Fones', name: 'Fones', icon: <Headphones size={18} /> },
  { id: 'Garrafas', name: 'Garrafas', icon: <GlassWater size={18} /> },
  { id: 'Portáteis', name: 'Portáteis', icon: <Laptop size={18} /> },
  { id: 'Suporte Veicular', name: 'Suporte Veicular', icon: <HardDrive size={18} /> },
  { id: 'Smartwatches', name: 'Smartwatches', icon: <Watch size={18} /> },
  { id: 'Cabos', name: 'Cabos', icon: <Cable size={18} /> },
  { id: 'Caixas de Som', name: 'Caixas de Som', icon: <Speaker size={18} /> },
  { id: 'Outros', name: 'Outros', icon: <Package size={18} /> },
];