
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, Navigation, Home, Route, HelpCircle, Phone, AlertTriangle, Info } from 'lucide-react';
import { mockDeliveryPartners } from '@/lib/mockData'; 
import type { Order as OrderType, DeliveryPartner as DeliveryPartnerType, OrderStatus, OrderItem as OrderItemType } from '@/lib/types'; 
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

const getOrderStatusSteps = (status: string) => {
  const steps = [
    { name: 'Order Placed', completed: false },
    { name: 'Confirmed', completed: false },
    { name: 'Processing', completed: false },
    { name: 'Out for Delivery', completed: false },
    { name: 'Delivered', completed: false },
  ];

  const statusLower = status.toLowerCase();
  let completedIndex = -1;

  if (statusLower.includes('delivered')) completedIndex = 4;
  else if (statusLower.includes('out for delivery') || statusLower.includes('shipped')) completedIndex = 3;
  else if (statusLower.includes('processing')) completedIndex = 2;
  else if (statusLower.includes('confirmed')) completedIndex = 1; 
  else if (statusLower.includes('placed')) completedIndex = 0;

  return steps.map((step, index) => ({
    ...step,
    completed: index <= completedIndex,
    current: index === completedIndex && index !==4 
  }));
};

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartnerType | null>(null);
  const [eta, setEta] = useState<number>(15); 
  const [distance, setDistance] = useState<number>(5.2); 
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        console.error("TrackOrderPage: orderId is undefined or null from URL parameters.");
        setPageError("Order ID is missing in the URL.");
        setIsLoading(false);
        return;
      }

      console.log("TrackOrderPage: Received orderId from params:", orderId);
      setIsLoading(true);
      setPageError(null);

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          const fetchedOrder: OrderType = {
            id: orderSnap.id,
            userId: data.userId,
            items: data.items as OrderItemType[], // Assuming items structure matches OrderItemType
            totalAmount: data.totalAmount || data.total, // Firestore might use 'total'
            status: data.orderStatus as OrderStatus,
            deliveryAddress: data.address, // Assuming Firestore 'address' matches OrderAddress
            orderDate: (data.orderDate as Timestamp).toDate().toISOString(),
            estimatedDeliveryTime: data.estimatedDeliveryTime ? ((data.estimatedDeliveryTime as Timestamp).toDate().toISOString()) : undefined,
            deliveryPartnerId: data.deliveryPartnerId,
            // Include other fields from Firestore if necessary
            deliveryCharge: data.deliveryCharge,
            discountAmount: data.discountAmount,
          };
          setOrder(fetchedOrder);

          const partner = mockDeliveryPartners.find(dp => dp.id === fetchedOrder.deliveryPartnerId) || mockDeliveryPartners[0];
          setDeliveryPartner(partner);

          const orderDateObj = new Date(fetchedOrder.orderDate);
          const estimatedDelivery = fetchedOrder.estimatedDeliveryTime ? new Date(fetchedOrder.estimatedDeliveryTime) : new Date(orderDateObj.getTime() + 30 * 60000);
          const now = new Date();
          const remainingMinutes = Math.max(0, Math.round((estimatedDelivery.getTime() - now.getTime()) / 60000));
          
          if (fetchedOrder.status.toLowerCase() === 'delivered') {
              setEta(0);
              setDistance(0);
          } else if (['cancelled', 'failed'].includes(fetchedOrder.status.toLowerCase())) {
              setEta(0);
              setDistance(0);
          } else if (remainingMinutes > 0) {
              setEta(remainingMinutes);
              setDistance(parseFloat(Math.max(0.1, remainingMinutes * 0.35).toFixed(1)));
          } else {
              setEta(fetchedOrder.status.toLowerCase().includes('out for delivery') ? 5 : 10); 
              setDistance(fetchedOrder.status.toLowerCase().includes('out for delivery') ? 1.5 : 3.0);
          }

        } else {
          console.warn(`Order with ID ${orderId} not found in Firestore.`);
          setOrder(null);
          setPageError(`Order with ID ${orderId} not found.`);
          // Fallback to generic partner/ETA for UI structure if needed, or hide sections
          setDeliveryPartner(mockDeliveryPartners[0]);
          setEta(30);
          setDistance(5.0);
        }
      } catch (error) {
        console.error("Error fetching order from Firestore:", error);
        setPageError("Failed to fetch order details. Please try again.");
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order || ['Delivered', 'Cancelled', 'Failed'].includes(order.status as string) || isLoading) {
      return; 
    }

    const simulationInterval = setInterval(() => {
      setEta(prevEta => {
        const newEta = Math.max(0, prevEta - 1);
        if (newEta === 0 && order && order.status !== 'Delivered') {
          // Simulate status update to Delivered
          setOrder(o => o ? ({ ...o, status: 'Delivered' as OrderStatus }) : null);
        }
        return newEta;
      });
      setDistance(prevDistance => parseFloat(Math.max(0, prevDistance - 0.35).toFixed(1)));
    }, 5000); // Reduced interval for faster simulation for demo

    return () => clearInterval(simulationInterval);
  }, [order, isLoading]);

  const orderStatusSteps = useMemo(() => order ? getOrderStatusSteps(order.status) : getOrderStatusSteps('Placed'), [order]);

  if (isLoading) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-96 w-full mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-40 md:col-span-2" />
                <Skeleton className="h-40" />
            </div>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Truck className="mr-3 h-8 w-8" /> Order Tracking
        </h1>
        <p className="text-muted-foreground mt-1">Order ID: {orderId?.substring(0,10) || 'N/A'}...</p>
      </header>

      {pageError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
      )}

      {!order && !isLoading && !pageError && ( // Order ID was present but order not found in DB
        <Alert variant="default" className="mb-6 border-primary/30 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Order Not Found</AlertTitle>
          <AlertDescription>
            We could not find details for order ID <span className="font-semibold">{orderId}</span>. Please check the ID or contact support.
          </AlertDescription>
        </Alert>
      )}
            
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent"/>Delivery Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '450px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57302.63291536073!2d85.86197830599366!3d26.15062508977816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb835434acdb1%3A0x70ec31d04822699e!2sDarbhanga%2C%20Bihar!5e0!3m2!1sen!2sin!4v1749675032868!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border:0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </CardContent>
          </Card>
            
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-accent"/>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order && order.items && order.items.length > 0 ? (
                <>
                  <ul className="space-y-3">
                      {order.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0">
                              {item.imageUrl ? (
                                  <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded object-cover aspect-square border" data-ai-hint="order item track" />
                              ) : (
                                   <div className="w-[50px] h-[50px] bg-muted rounded flex items-center justify-center">
                                      <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                              )}
                              <div className="flex-grow">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                              </div>
                              <p className="text-sm font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </li>
                      ))}
                  </ul>
                  <Separator className="my-4" />
                  <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal: ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                      { (order.deliveryCharge ?? 0) > 0 && <p className="text-xs text-muted-foreground">Delivery: ₹{order.deliveryCharge?.toFixed(2)}</p> }
                      { (order.discountAmount ?? 0) > 0 && <p className="text-xs text-green-600">Discount: -₹{order.discountAmount?.toFixed(2)}</p> }
                      <p className="text-lg font-bold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No items to display for this order or order details not found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Route className="mr-2 h-5 w-5 text-accent"/>Delivery Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-semibold text-primary">
                        <Clock className="mr-2 h-5 w-5"/> 
                        ETA: {eta > 0 ? `~${eta} min` : (order && order.status === 'Delivered' ? 'Delivered' : 'Arriving Soon')}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Navigation className="mr-1 h-4 w-4"/> {distance > 0 ? `${distance} km` : '-'}
                    </div>
                </div>
                <Progress 
                    value={order && order.status === 'Delivered' ? 100 : (orderStatusSteps.findIndex(s=>s.current) / (orderStatusSteps.length -1)) * 100 || (orderStatusSteps.filter(s => s.completed).length / (orderStatusSteps.length -1)) * 100} 
                    aria-label={`Order status: ${order ? order.status : 'Unknown'}, ${eta} minutes remaining`} 
                    className="w-full h-2" />
                
                <div className="space-y-3 mt-3 pt-3 border-t">
                    {orderStatusSteps.map((step, index) => (
                        <div key={index} className={`flex items-center ${step.completed ? 'text-green-600' : 'text-muted-foreground'} ${step.current ? 'font-semibold text-primary animate-pulse' : ''}`}>
                            {step.completed ? <Home className="h-4 w-4 mr-2"/> : <Home className="h-4 w-4 mr-2 opacity-50"/>}
                            <span>{step.name}</span>
                        </div>
                    ))}
                </div>
                <Separator/>
                 <p className="text-sm">Current Status: <span className="font-semibold text-primary">{order ? order.status : 'Unknown'}</span></p>
                 <p className="text-xs text-muted-foreground">Last updated: {order ? new Date(order.orderDate).toLocaleTimeString() : new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>

          {deliveryPartner && order && (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><Truck className="mr-2 h-5 w-5 text-accent"/>Delivery Partner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p><strong>{deliveryPartner.name}</strong></p>
                    <p className="text-xs text-muted-foreground">{deliveryPartner.vehicleDetails}</p>
                    {deliveryPartner.rating && <p className="text-xs text-muted-foreground">Rating: {deliveryPartner.rating} ★</p>}
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => alert('Contacting delivery partner... (Feature not implemented)')}>
                        <Phone className="mr-1.5 h-3.5 w-3.5"/> Contact Rider
                    </Button>
                </CardContent>
            </Card>
          )}

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-accent"/>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

