
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, Navigation, Home, Route, HelpCircle, Phone, AlertTriangle, Info, UserCheck } from 'lucide-react';
import { mockDeliveryPartners } from '@/lib/mockData'; 
import type { Order as OrderType, DeliveryPartner as DeliveryPartnerType, OrderStatus, OrderItem as OrderItemType, OrderAddress } from '@/lib/types'; 
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

const getOrderStatusSteps = (status: string) => {
  const steps = [
    { name: 'Order Placed', completed: false, current: false },
    { name: 'Confirmed', completed: false, current: false },
    { name: 'Processing', completed: false, current: false },
    { name: 'Out for Delivery', completed: false, current: false },
    { name: 'Delivered', completed: false, current: false },
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
    current: index === completedIndex && completedIndex !==4 
  }));
};

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartnerType | null>(null);
  const [eta, setEta] = useState<number | null>(null); 
  const [distance, setDistance] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        console.error("TrackOrderPage: orderId is undefined from URL.");
        setPageError("Order ID is missing in the URL.");
        setIsLoading(false);
        return;
      }

      console.log("TrackOrderPage: Fetching order with ID:", orderId);
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
            items: data.items as OrderItemType[],
            totalAmount: data.totalAmount || data.total,
            status: data.orderStatus as OrderStatus,
            deliveryAddress: data.address as OrderAddress,
            orderDate: (data.orderDate as Timestamp).toDate().toISOString(),
            estimatedDeliveryTime: data.estimatedDeliveryTime ? ((data.estimatedDeliveryTime as Timestamp).toDate().toISOString()) : undefined,
            deliveryPartnerId: data.deliveryPartnerId, // Ensure this is fetched
            name: data.name,
            phoneNumber: data.phoneNumber,
            shippingMethod: data.shippingMethod,
            paymentMethod: data.paymentMethod,
            promoCodeApplied: data.promoCodeApplied,
            discountAmount: data.discountAmount,
            deliveryCharge: data.deliveryCharge,
            gstAmount: data.gstAmount,
            handlingCharge: data.handlingCharge,
          };
          setOrder(fetchedOrder);

          if (fetchedOrder.deliveryPartnerId) {
            const partner = mockDeliveryPartners.find(dp => dp.id === fetchedOrder.deliveryPartnerId);
            setDeliveryPartner(partner || null); // Set to null if not found
          } else {
            setDeliveryPartner(null); // No partner assigned
          }

          const orderDateObj = new Date(fetchedOrder.orderDate);
          const estimatedDelivery = fetchedOrder.estimatedDeliveryTime ? new Date(fetchedOrder.estimatedDeliveryTime) : new Date(orderDateObj.getTime() + 30 * 60000); // Default 30 min
          const now = new Date();
          const remainingMinutes = Math.max(0, Math.round((estimatedDelivery.getTime() - now.getTime()) / 60000));
          
          if (fetchedOrder.status.toLowerCase() === 'delivered') {
              setEta(0);
              setDistance(0);
          } else if (['cancelled', 'failed'].includes(fetchedOrder.status.toLowerCase())) {
              setEta(0); // Or null/specific message
              setDistance(0); // Or null
          } else if (remainingMinutes > 0) {
              setEta(remainingMinutes);
              setDistance(parseFloat(Math.max(0.1, remainingMinutes * 0.35).toFixed(1))); // Simulated distance
          } else { // Order is past estimated time but not delivered
              setEta(fetchedOrder.status.toLowerCase().includes('out for delivery') ? 5 : 10); 
              setDistance(fetchedOrder.status.toLowerCase().includes('out for delivery') ? 1.5 : 3.0);
          }

        } else {
          console.warn(`Order with ID ${orderId} not found in Firestore.`);
          setOrder(null);
          setDeliveryPartner(null);
          setPageError(`Order with ID ${orderId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching order from Firestore:", error);
        setPageError("Failed to fetch order details. Please try again.");
        setOrder(null);
        setDeliveryPartner(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // Simulation for ETA, distance, and status (if not delivered/cancelled/failed)
  useEffect(() => {
    if (!order || ['delivered', 'cancelled', 'failed'].includes(order.status.toLowerCase()) || isLoading || eta === 0) {
      return; 
    }

    const simulationInterval = setInterval(() => {
      setEta(prevEta => {
        const newEta = Math.max(0, (prevEta || 5) - 1); // Use 5 as default if prevEta is null
        if (newEta === 0 && order && !['delivered', 'cancelled', 'failed'].includes(order.status.toLowerCase())) {
          setOrder(o => o ? ({ ...o, status: 'Delivered' as OrderStatus }) : null);
        }
        return newEta;
      });
      setDistance(prevDistance => parseFloat(Math.max(0, (prevDistance || 1) - 0.35).toFixed(1)));
    }, 5000); // Interval for simulation

    return () => clearInterval(simulationInterval);
  }, [order, isLoading, eta]);


  const orderStatusSteps = useMemo(() => order ? getOrderStatusSteps(order.status) : getOrderStatusSteps('Placed'), [order]);

  const renderMap = () => {
    // Keeping the iframe for now as per previous request
    return (
      <div style={{ width: '100%', height: '450px', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57302.63291536073!2d85.86197830599366!3d26.15062508977816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb835434acdb1%3A0x70ec31d04822699e!2sDarbhanga%2C%20Bihar!5e0!3m2!1sen!2sin!4v1749675032868!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border:0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Delivery Map (Static Placeholder)"
          data-ai-hint="static map embed"
          >
        </iframe>
      </div>
    );
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-10 px-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-96 w-full mb-6" /> {/* Map placeholder */}
            <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-40 md:col-span-2" /> {/* Items placeholder */}
                <Skeleton className="h-40" /> {/* Status placeholder */}
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

      {!order && !isLoading && !pageError && (
        <Alert variant="default" className="mb-6 border-primary/30 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Order Information</AlertTitle>
          <AlertDescription>
            Details for order ID <span className="font-semibold">{orderId}</span> could not be loaded.
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
              {renderMap()}
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
                        ETA: {eta !== null && eta > 0 ? `~${eta} min` : (order && order.status.toLowerCase() === 'delivered' ? 'Delivered' : (eta === 0 ? 'Arriving Soon' : 'Calculating...'))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Navigation className="mr-1 h-4 w-4"/> {distance !== null && distance > 0 ? `${distance} km` : (order && order.status.toLowerCase() === 'delivered' ? '-' : '...')}
                    </div>
                </div>
                <Progress 
                    value={order && order.status.toLowerCase() === 'delivered' ? 100 : 
                           (orderStatusSteps.findIndex(s=>s.current) / (orderStatusSteps.length -1)) * 100 || 
                           (orderStatusSteps.filter(s => s.completed).length / (orderStatusSteps.length -1)) * 100} 
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
                 <p className="text-xs text-muted-foreground">Last updated: {order ? new Date(order.orderDate).toLocaleTimeString() : 'N/A'}</p>
            </CardContent>
          </Card>

          {order && (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      {deliveryPartner ? <Truck className="mr-2 h-5 w-5 text-accent"/> : <UserCheck className="mr-2 h-5 w-5 text-muted-foreground"/>}
                      Delivery Partner
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {deliveryPartner ? (
                    <>
                      <p><strong>{deliveryPartner.name}</strong></p>
                      <p className="text-xs text-muted-foreground">{deliveryPartner.vehicleDetails}</p>
                      {deliveryPartner.rating && <p className="text-xs text-muted-foreground">Rating: {deliveryPartner.rating} ★</p>}
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => alert('Contacting delivery partner... (Feature not implemented)')}>
                          <Phone className="mr-1.5 h-3.5 w-3.5"/> Contact Rider
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Awaiting delivery partner assignment...</p>
                  )}
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
