
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: Array<{ url: string; dataAiHint?: string }>; // Supports multiple images with individual hints
  dataAiHint?: string; // Product-level fallback hint
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
  name?: string; // Recipient name, made optional as it might be part of user profile
  phoneNumber?: string; // Recipient phone, made optional
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // Price at the time of order
  imageUrl?: string; // Optional: if stored with the order item
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Failed'
  | 'Placed'; // Added 'Placed' as it's used in Firestore save

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: OrderAddress; // Contains name and phone
  orderDate: string; // ISO string
  estimatedDeliveryTime?: string; // ISO string or descriptive like "8 minutes"
  deliveryPartnerId?: string; // Made optional
  // Fields from FirestoreOrder that might be directly on OrderType
  name?: string; // Recipient's name (if not in deliveryAddress directly)
  phoneNumber?: string; // Recipient's phone (if not in deliveryAddress directly)
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
