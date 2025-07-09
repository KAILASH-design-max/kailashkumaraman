

export interface Product {
  id: string; // Document ID from Firestore
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating?: number;
  reviewsCount?: number;
  stock: number;
  lowStockThreshold?: number;
  weight?: string;
  status: 'active' | 'inactive' | 'archived' | string;
  origin?: string;
  popularity?: number;
  createdAt: string; // ISO string for client-side, Firestore converts to Timestamp
  updatedAt?: string;
  dataAiHint?: string;
}

export interface Category {
  id: string;
  slug: string; // Retained for category filtering URLs
  name: string;
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
  name?: string;
  phoneNumber?: string;
}

export interface Address {
  id: string; // Firestore document ID
  userId: string;
  name: string; // e.g., 'Home', 'Work'
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Failed'
  | 'Placed'
  | 'Return Requested'
  | 'Return Approved'
  | 'Refunded';


export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: OrderAddress;
  orderDate: string;
  estimatedDeliveryTime?: string;
  deliveryPartnerId?: string | null;
  cancelledTimestamp?: string; // Added field for cancellation time
  name?: string;
  phoneNumber?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  promoCodeApplied?: string | null;
  discountAmount?: number;
  deliveryCharge?: number;
  gstAmount?: number;
  handlingCharge?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pastPurchases?: Product[];
  browsingHistory?: Product[];
  preferences?: string[];
  tastePreferences?: string;
  dietaryRequirements?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  currentOrder?: Order;
  vehicleDetails?: string;
  rating?: number;
}

export interface Review {
  id: string; // Document ID from Firestore
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string; // ISO string
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  expiresAt: string; // ISO string
  status: 'active' | 'inactive' | string;
  usageLimit?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethodDetails {
  cardNumberMasked?: string;
  upiId?: string;
  balance?: number;
}

export interface PaymentMethod {
  id: string; // Firestore document ID
  userId: string;
  type: 'card' | 'upi' | 'wallet';
  label: string;
  details: PaymentMethodDetails;
  isDefault?: boolean;
  createdAt: string; // ISO string for client
  updatedAt?: string; // ISO string for client
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
  addedAt: string; // ISO string
}

export interface Wishlist {
  id: string; // Firestore document ID
  userId: string;
  name: string;
  items: WishlistItem[];
  isPublic?: boolean;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}
