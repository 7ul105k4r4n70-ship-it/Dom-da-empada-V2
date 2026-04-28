export type Region = 'Recife' | 'Salvador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordenador' | 'analista';
  region: Region | 'Global';
  photoUrl?: string;
  status: 'Ativo' | 'Inativo';
}

export interface StatusHistory {
  status: 'COMPLETED' | 'IN PROGRESS' | 'AWAITING LOGISTICS' | 'IDLE';
  timestamp: string;
  userName: string;
  userId: string;
}

export interface Order {
  id: string;
  pointId: string;
  pointName: string;
  timestamp: string;
  units: number;
  status: 'COMPLETED' | 'IN PROGRESS' | 'AWAITING LOGISTICS' | 'IDLE';
  type: 'REGULAR' | 'EXTRA DELIVERY';
  driverName?: string;
  driverPhoto?: string;
  vehicle?: string;
  region: Region;
  lat?: number;
  lng?: number;
  statusHistory?: StatusHistory[];
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
