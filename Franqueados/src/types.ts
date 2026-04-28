export interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
  whatsapp: string;
}

export interface Franchisee {
  id: string;
  name: string;
  cnpj: string;
  contact: string;
  phone: string;
  points: DeliveryPoint[];
  region: 'Recife' | 'Salvador';
  initials: string;
}

export interface Activity {
  id: string;
  type: 'registration' | 'update' | 'activation';
  title: string;
  description: string;
  time: string;
}
