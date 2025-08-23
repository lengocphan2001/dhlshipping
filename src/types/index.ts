// Common types for DHL Shipping application

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Package {
  weight: number;
  length: number;
  width: number;
  height: number;
  description?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: Address;
  destination: Address;
  packages: Package[];
  service: string;
  status: ShipmentStatus;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export type ShipmentStatus = 
  | 'pending'
  | 'in_transit'
  | 'delivered'
  | 'exception'
  | 'returned';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ShippingRate {
  service: string;
  price: number;
  currency: string;
  deliveryTime: string;
  estimatedDays: number;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export type NavItemId = 'home' | 'import' | 'export' | 'account';
