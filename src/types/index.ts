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

// Product and Review types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  image?: string;
  category?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  tags?: string[] | string; // Can be array or JSON string from backend
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  user?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  userName?: string; // For display purposes
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number | string;
  image?: string;
  category?: string;
  stock: number;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  isActive?: boolean;
}

export interface ReviewCreateRequest {
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  tags?: string[];
}

export interface ReviewUpdateRequest {
  rating?: number;
  comment?: string;
  isApproved?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
