export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  dataAiHint?: string;
  rating?: number;
  reviewsCount?: number;
  stock?: number; // Added for inventory management
}

export interface Category {
  id: string;
  slug: string;
  name:string;
  imageUrl: string;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // Price at the time of order
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Failed';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: OrderAddress;
  orderDate: string; // ISO string
  estimatedDeliveryTime?: string; // ISO string or descriptive like "8 minutes"
  deliveryPartnerId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pastPurchases?: Product[];
  browsingHistory?: Product[];
  preferences?: string[]; // e.g. ['Dairy', 'Snacks']
  tastePreferences?: string; // For dietary recommendations
  dietaryRequirements?: string; // For dietary recommendations
}

export interface DeliveryPartner {
  id: string;
  name: string;
  currentOrder?: Order;
  vehicleDetails?: string;
  rating?: number;
}

export interface Review {
  id: string;
  orderId: string;
  productId?: string; // For product-specific review
  deliveryExperienceRating?: number; // 1-5
  productRating?: number; // 1-5
  comment?: string;
  userId: string;
  userName: string;
  date: string; // ISO string
}
