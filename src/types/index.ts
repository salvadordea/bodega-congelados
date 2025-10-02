export interface Client {
  id: string;
  name: string;
  rfc: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  clientId: string;
  spaceIds: number[];
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pricePerDay: number;
  handlingFee: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'active' | 'completed' | 'expired';
}

export interface Space {
  id: number;
  status: 'available' | 'reserved' | 'expiring-soon';
  reservationId?: string;
  clientId?: string;
  section: 'A' | 'B' | 'C' | 'D';
}

export interface PricingConfig {
  pricePerDayPerSpace: number;
  handlingFee: number;
  taxRate: number;
}
