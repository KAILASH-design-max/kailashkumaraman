
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string; // Matches schema's string type; consider ID ref for more complex scenarios
  imageUrl: string; // Changed from imageUrls array
  rating?: number;
  reviewsCount?: number;
  inStock: boolean; // Added
  stockCount: number; // Added, replaces optional stock
  weightVolume?: string; // Added
  origin?: string; // Added
  deliveryInfo?: string; // Added
  promoCodes?: string[]; // Added
  createdAt: string; // Added (ISO string for client-side representation)
  dataAiHint?: string; // Optional: Retained for general product hint if needed, though not in schema
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
  | 'Return Requested' // Added for return flow
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
  id: string;
  orderId: string;
  productId?: string;
  deliveryExperienceRating?: number;
  productRating?: number; // Matches 'rating' in schema
  reviewText?: string; // Matches 'reviewText' in schema
  userId: string;
  userName: string;
  date: string; // Matches 'createdAt' (as ISO string) in schema
}
