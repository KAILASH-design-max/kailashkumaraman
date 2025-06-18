
export interface Product {
  id: string; // Document ID from Firestore
  name: string;
  description: string;
  price: number;
  category: string; // Category name or ID (string as per schema)
  imageUrl: string;
  rating?: number;
  reviewsCount?: number;
  stock: number; // Replaces inStock and stockCount
  weight?: string; // Replaces weightVolume
  status?: string; // e.g., "In Stock", "Out of Stock"
  origin?: string;
  // deliveryInfo?: string; // Removed as not in new schema
  // promoCodes?: string[]; // Removed, handled by separate collection
  createdAt: string; // ISO string for client-side, Firestore converts to Timestamp
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
  deliveryPartnerId?: string;
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
  userId: string;
  userName: string;
  rating: number;
  comment?: string; // Changed from reviewText
  reviewedAt: string; // Changed from date/createdAt (ISO string)
  // orderId?: string; // Optional if reviews are only subcollection of product
  // productId?: string; // Implicit from subcollection path
}

export interface PromoCode {
  id: string; // Document ID from Firestore (e.g., "SAVE20")
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  expiresAt: string; // ISO string
  isActive: boolean;
  appliesTo?: Array<string>; // Array of product IDs or category IDs/slugs
  description?: string; // Added for better display
}
