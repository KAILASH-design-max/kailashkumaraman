
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ListOrdered, Filter, Repeat, RotateCcw, PackageSearch, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp, type DocumentData } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import Image from 'next/image'; // For displaying item images

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
    phone: string;
}

interface FirestoreOrder extends DocumentData {
  id: string; // Firestore document ID
  userId: string;
  name: string; // Recipient's name
  phone: string;
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
      }, (err) => {
        console.error("Error fetching orders: ", err);
        setError("Failed to fetch orders. Please try again later.");
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
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
        <p>{error}</p>
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

      {/* Placeholder for filter controls - Future Implementation */}
      {/* <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Filter & Search Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter by Status</Button>
            <input type="date" className="input border p-2 rounded-md text-sm" placeholder="Filter by date"/>
          </div>
        </CardContent>
      </Card> */}

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
                    <p className="text-xs text-muted-foreground">{order.address.name}</p>
                    <p className="text-xs text-muted-foreground">{order.address.street}</p>
                    <p className="text-xs text-muted-foreground">{order.address.city}, {order.address.postalCode}, {order.address.country}</p>
                    <p className="text-xs text-muted-foreground">Phone: {order.address.phone}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => alert(`Tracking order ${order.id}... (placeholder)`)}>
                    <PackageSearch className="mr-2 h-4 w-4" /> View Details / Track
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => alert(`Reordering items from order ${order.id}... (placeholder)`)}>
                    <Repeat className="mr-2 h-4 w-4" /> Reorder
                  </Button>
                  {(order.orderStatus.toLowerCase() === 'delivered') && (
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => alert(`Initiating return for order ${order.id}... (placeholder)`)}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Initiate Return
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
