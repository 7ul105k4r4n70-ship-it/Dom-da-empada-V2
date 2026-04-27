export type Region = 'Recife' | 'Salvador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'usuario' | 'motorista';
  region: Region;
  photoUrl?: string;
  status: 'Ativo' | 'Inativo';
  phone?: string;
  vehicle?: string;
  lat?: number;
  lng?: number;
}

export interface StatusHistory {
  status: 'COMPLETED' | 'IN PROGRESS' | 'AWAITING LOGISTICS' | 'IDLE';
  timestamp: string;
  userName: string;
  userId: string;
}

export interface Order {
  id: string;
  short_id?: number;
  pointId: string;
  pointName: string;
  point_name?: string;
  timestamp: string;
  created_at?: string;
  units: number;
  status: 'COMPLETED' | 'IN PROGRESS' | 'IN_PROGRESS' | 'AWAITING LOGISTICS' | 'IDLE' | 'CANCELLED' | 'DELIVERED' | 'IN_TRANSIT' | 'ACCEPTED';
  type: 'REGULAR' | 'EXTRA DELIVERY';
  driverName?: string;
  driverPhoto?: string;
  vehicle?: string;
  region: Region;
  lat?: number;
  lng?: number;
  deliveryPhoto?: string;
  statusHistory?: StatusHistory[];
}

export interface ExtraDelivery {
  id: string;
  date: string;
  pointName: string;
  valuePerDelivery: number;
  region: Region;
}

export interface DriverExtras {
  id: string;
  driverName: string;
  region: Region;
  totalExtras: number;
  workDays: string[];
  totalValue: number;
  deliveries: ExtraDelivery[];
}

export interface FranchiseePoint {
  id: string;
  name: string;
  location: string;
  activeOrders: number;
  volumeToday: number;
  status: string;
  region: Region;
  lat?: number;
  lng?: number;
}

export interface ProductPrice {
  id: string;
  name: string;
  description: string;
  costPrice: number;
  suggestedPrice: number;
  imageUrl: string;
}

export interface RoyaltyInfo {
  franchiseeName: string;
  percent: number;
  amount: number;
  status: 'PROCESSADO' | 'AGUARDANDO';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'schedule' | 'stock' | 'system';
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  userId: string;
  link?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  photo_url?: string;
  current_km: number;
  next_oil_change_km: number;
  oil_change_interval: number;
  next_revision_km: number;
  revision_interval: number;
  region: Region;
  status: 'Ativo' | 'Manutenção' | 'Inativo';
  fuel_level?: number | null;
  assigned_driver_id?: string | null;
  created_at?: string;
}

