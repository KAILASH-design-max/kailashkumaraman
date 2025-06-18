
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ListOrdered, Filter, Repeat, RotateCcw, PackageSearch, ShoppingBag, Loader2, Phone, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp, type DocumentData } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import Image from 'next/image'; // For displaying item images
import { useCart } from '@/hooks/useCart';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Define a more specific type for Firestore order data
interface FirestoreOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string; // Optional: if stored with the order item
}

interface FirestoreOrderAddress {
    name: string; // Recipient's name
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

interface FirestoreOrder extends DocumentData {
  id: string; // Firestore document ID
  userId: string;
  name: string; // Recipient's name
  phoneNumber: string;
  address: FirestoreOrderAddress; // Full address object
  items: FirestoreOrderItem[];
  total: number; // totalAmount
  orderStatus: string; // 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
  orderDate: Timestamp; // Firestore Timestamp
  shippingMethod?: string;
  paymentMethod?: string;
  promoCodeApplied?: string | null;
  discountAmount?: number;
  deliveryCharge?: number;
  gstAmount?: number;
  handlingCharge?: number;
}


export default function OrdersPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
        setOrders([]); // Clear orders if user logs out
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', currentUser.uid), orderBy('orderDate', 'desc'));

      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const fetchedOrders: FirestoreOrder[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as FirestoreOrder);
        });
        setOrders(fetchedOrders);
        setIsLoading(false);
      }, (firestoreError: any) => { 
        console.error("Firestore onSnapshot error fetching orders: ", firestoreError);
        let detailedMessage = "Failed to fetch orders. Please try again later.";
        if (firestoreError.code === 'permission-denied') {
          detailedMessage = "Permission denied. Please check your Firestore security rules to ensure you have read access to your orders.";
        } else if (firestoreError.code === 'failed-precondition' && firestoreError.message.includes('index')) {
            const match = firestoreError.message.match(/(https:\/\/console\.firebase\.google\.com\/.*?)(?:\.$|\s|$)/);
            const indexCreationLink = match ? match[1] : null;

            detailedMessage = `Your orders query needs a specific Firestore index.
Required fields and order:
1. 'userId' (Ascending)
2. 'orderDate' (Descending)
3. '__name__' (Ensure its direction - Ascending/Descending - in your Firebase console *exactly* matches the Firebase recommendation in the error link).

Please use the link provided by Firebase to create this index. If the error persists, double-check that the collection name in your Firestore database ('orders') matches your query, and that *all* fields and their sort directions (Ascending/Descending), especially for '__name__', are exactly as recommended by Firebase in the error link.`;
            
            if (indexCreationLink) {
                detailedMessage += `\n\nFirebase Index Creation Link (copy and paste if not clickable):\n${indexCreationLink}`;
            } else {
                detailedMessage += `\n\nFirebase error details: ${firestoreError.message}`;
            }
        } else if (firestoreError.message) {
          detailedMessage = `Failed to fetch orders: ${firestoreError.message}`;
        }
        setError(detailedMessage);
        setIsLoading(false);
      });

      return () => unsubscribeFirestore();
    } else {
      // No user logged in, or user logged out
      setIsLoading(false);
      setOrders([]);
    }
  }, [currentUser]);

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
      case 'confirmed':
      case 'placed':
      case 'return requested': // Added for return status
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'failed':
      case 'return rejected': // Added for return status
        return 'bg-red-100 text-red-700';
      case 'return approved': // Added for return status
      case 'refunded': // Added for return status
         return 'bg-purple-100 text-purple-700'; // Or another distinct color
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleReorder = (orderId: string) => {
    const orderToReorder = orders.find(order => order.id === orderId);
    if (!orderToReorder) {
      toast({
        title: "Reorder Failed",
        description: "Could not find the order details.",
        variant: "destructive",
      });
      return;
    }

    let itemsAddedCount = 0;
    orderToReorder.items.forEach(item => {
      const productDetails = mockProducts.find(p => p.id === item.productId);
      if (productDetails) {
        addToCart(productDetails, item.quantity);
        itemsAddedCount++;
      } else {
        console.warn(`Product with ID ${item.productId} not found in mockProducts for reorder.`);
      }
    });

    if (itemsAddedCount > 0) {
      toast({
        title: "Items Reordered",
        description: `${itemsAddedCount} item(s) from order ${orderId.substring(0,6)}... have been added to your cart.`,
      });
    } else {
       toast({
        title: "Reorder Information",
        description: "No items could be added to the cart. Product details might be unavailable.",
        variant: "default",
      });
    }
  };

  const canInitiateReturnForOrder = (orderStatus: string) => {
    // Show "Initiate Return" button only if the order status is 'Delivered' (case-insensitive).
    return orderStatus.toLowerCase() === 'delivered';
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (!currentUser && !isLoading) {
     return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg mb-4">Please log in to view your order history.</p>
        <Button asChild>
          <Link href="/login?redirect=/profile/orders">Log In</Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center text-destructive">
        <p className="font-semibold">Error Loading Orders:</p>
        <p className="text-sm whitespace-pre-wrap">{error}</p>
         <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile Dashboard
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <ListOrdered className="mr-3 h-8 w-8" /> Order History
        </h1>
        <p className="text-muted-foreground mt-1">
          View your complete order history, track statuses, and manage your purchases.
        </p>
      </header>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">You haven't placed any orders yet.</p>
                <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here!</p>
                <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg">Order ID: {order.id.substring(0,10)}...</CardTitle>
                    <CardDescription>Date: {formatDate(order.orderDate)} | Total: ₹{order.total.toFixed(2)}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full self-start sm:self-center ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">Items:</h4>
                    <ul className="space-y-2">
                        {order.items.map((item, index) => (
                            <li key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0">
                                {item.imageUrl && (
                                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded object-cover aspect-square" data-ai-hint="order item" />
                                )}
                                <div className="flex-grow">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-sm font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <Separator className="my-3"/>
                 <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">Shipping Address:</h4>
                    <p className="text-xs text-muted-foreground"><strong>{order.name}</strong></p>
                    <p className="text-xs text-muted-foreground">{order.address.street}</p>
                    <p className="text-xs text-muted-foreground">{order.address.city}, {order.address.postalCode}, {order.address.country}</p>
                    <p className="text-xs text-muted-foreground flex items-center"><Phone className="mr-1.5 h-3 w-3"/> {order.phoneNumber || order.address.phoneNumber || 'N/A'}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/profile/orders/${order.id}/track`}>
                      <Truck className="mr-2 h-4 w-4" /> View Details / Track
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReorder(order.id)}>
                    <Repeat className="mr-2 h-4 w-4" /> Reorder
                  </Button>
                  {canInitiateReturnForOrder(order.orderStatus) && (
                    <Button variant="destructive" size="sm" className="flex-1" asChild>
                      <Link href={`/profile/orders/${order.id}/initiate-return`}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Initiate Return
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

