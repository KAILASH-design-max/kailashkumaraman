
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, Navigation, Home, Route, HelpCircle, Phone, AlertTriangle, Info, UserCheck, CheckCircle, Circle } from 'lucide-react';
import type { Order as OrderType, OrderStatus, OrderItem as OrderItemType, OrderAddress } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

const ORDER_STATUS_SEQUENCE: OrderStatus[] = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];

const getOrderStatusSteps = (currentStatus: OrderStatus | undefined) => {
  const steps: { name: OrderStatus; completed: boolean; current: boolean; icon: React.ElementType }[] = ORDER_STATUS_SEQUENCE.map(statusName => ({
    name: statusName,
    completed: false,
    current: false,
    icon: Circle, // Default pending
  }));

  if (!currentStatus) {
    steps[0].current = true; // Default to 'Placed' if no status
    steps[0].icon = Clock;
    return steps;
  }

  const currentStatusLower = currentStatus.toLowerCase();
  let currentIndex = ORDER_STATUS_SEQUENCE.findIndex(s => s.toLowerCase() === currentStatusLower);

  // Handle synonyms or related statuses
  if (currentIndex === -1) {
    if (currentStatusLower.includes('shipped') || currentStatusLower.includes('out for delivery')) currentIndex = 3;
    else if (currentStatusLower.includes('confirmed')) currentIndex = 1;
    else if (currentStatusLower.includes('processing')) currentIndex = 2;
    else if (currentStatusLower.includes('placed')) currentIndex = 0;
    else if (currentStatusLower.includes('delivered')) currentIndex = 4;
    else currentIndex = 0; // Fallback to 'Placed'
  }


  return steps.map((step, index) => {
    const completed = index < currentIndex || (index === currentIndex && currentStatusLower === 'delivered');
    const current = index === currentIndex && !completed;
    let icon = Circle;
    if (completed) icon = CheckCircle;
    else if (current) icon = Clock; // Or a different icon for current, e.g., Truck for 'Out for Delivery'

    if (current && step.name === 'Out for Delivery') icon = Truck;
    if (current && step.name === 'Processing') icon = Route;


    return {
      ...step,
      completed,
      current,
      icon,
    };
  });
};

interface AssignedDeliveryPartner {
  name: string;
  phoneNumber: string;
  vehicleDetails?: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params.orderId as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [assignedDeliveryPartner, setAssignedDeliveryPartner] = useState<AssignedDeliveryPartner | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null); // ETA in minutes
  const [distance, setDistance] = useState<number | null>(null); // Simulated distance
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!orderIdParam) {
        setPageError("Order ID is missing in the URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setOrder(null);
      setAssignedDeliveryPartner(null);
      setPageError(null);

      try {
        // Fetch Order
        const orderRef = doc(db, "orders", orderIdParam);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          if (!data.userId || !data.items || (typeof data.totalAmount !== 'number' && typeof data.total !== 'number') || !data.orderStatus || !data.address || !data.orderDate) {
            setPageError("Order data is incomplete or malformed. Please contact support.");
          } else {
            const fetchedOrder: OrderType = {
              id: orderSnap.id,
              userId: data.userId,
              items: data.items as OrderItemType[],
              totalAmount: data.totalAmount || data.total,
              status: data.orderStatus as OrderStatus,
              deliveryAddress: data.address as OrderAddress,
              orderDate: (data.orderDate as Timestamp).toDate().toISOString(),
              estimatedDeliveryTime: data.estimatedDeliveryTime ? ((data.estimatedDeliveryTime as Timestamp).toDate().toISOString()) : undefined,
              deliveryPartnerId: data.deliveryPartnerId || null, // Ensure it's null if not present
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

            // Calculate ETA/Distance based on fetched order
            if (fetchedOrder.status.toLowerCase() === 'delivered') {
              setEtaMinutes(0); setDistance(0);
            } else if (['cancelled', 'failed', 'return requested', 'return approved', 'refunded'].includes(fetchedOrder.status.toLowerCase())) {
              setEtaMinutes(0); setDistance(0);
            } else if (fetchedOrder.estimatedDeliveryTime) {
              const estimatedDelivery = new Date(fetchedOrder.estimatedDeliveryTime);
              const now = new Date();
              const remainingMs = estimatedDelivery.getTime() - now.getTime();
              const remainingMinutes = Math.max(0, Math.round(remainingMs / 60000));
              setEtaMinutes(remainingMinutes);
              setDistance(parseFloat(Math.max(0.1, remainingMinutes * 0.35).toFixed(1)));
            } else {
               // Fallback if no estimatedDeliveryTime
              const orderDateObj = new Date(fetchedOrder.orderDate);
              const fallbackEta = new Date(orderDateObj.getTime() + (fetchedOrder.status.toLowerCase().includes('out for delivery') ? 15 : 30) * 60000); // 15 or 30 min default
              const now = new Date();
              const remainingMinutes = Math.max(0, Math.round((fallbackEta.getTime() - now.getTime()) / 60000));
              setEtaMinutes(remainingMinutes);
              setDistance(parseFloat(Math.max(0.1, remainingMinutes * 0.35).toFixed(1)));
            }
            

            // Fetch assigned delivery partner if ID exists
            if (fetchedOrder.deliveryPartnerId) {
              try {
                const partnerRef = doc(db, "users", fetchedOrder.deliveryPartnerId);
                const partnerSnap = await getDoc(partnerRef);
                if (partnerSnap.exists()) {
                  const partnerData = partnerSnap.data();
                  if (partnerData.role === "deliveryBoy" && partnerData.availabilityStatus === "online") {
                    setAssignedDeliveryPartner({
                      name: partnerData.name || "N/A",
                      phoneNumber: partnerData.phoneNumber || "N/A",
                      vehicleDetails: partnerData.vehicleDetails || undefined,
                    });
                  } else {
                    // Partner assigned but not online or not a deliveryBoy role
                    setAssignedDeliveryPartner(null); 
                  }
                } else {
                  // Partner ID on order, but partner document not found
                  setAssignedDeliveryPartner(null);
                }
              } catch (partnerError: any) {
                console.error("Error fetching assigned delivery partner:", partnerError);
                setAssignedDeliveryPartner(null); // Treat as no partner found on error
              }
            } else {
              // No deliveryPartnerId on the order
              setAssignedDeliveryPartner(null);
            }
          }
        } else {
          setPageError(`Order with ID ${orderIdParam} not found.`);
        }
      } catch (error: any) {
        setPageError(`Failed to fetch order details: ${error.message || "Please try again."}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [orderIdParam]);

  // Client-side ETA countdown simulation
 useEffect(() => {
    if (!order || ['delivered', 'cancelled', 'failed', 'return requested', 'return approved', 'refunded'].includes(order.status.toLowerCase()) || isLoading || etaMinutes === 0 || etaMinutes === null) {
      return;
    }

    const intervalId = setInterval(() => {
      setEtaMinutes(prevEta => {
        const newEta = Math.max(0, (prevEta || 1) - 1); // Ensure prevEta is at least 1 before decrementing
        if (newEta === 0 && order && !['delivered', 'cancelled', 'failed', 'return requested', 'return approved', 'refunded'].includes(order.status.toLowerCase())) {
          // This is a client-side simulation. Actual status update should come from backend.
          // For UI effect, we can update here, but be mindful of backend truth.
          // setOrder(o => o ? ({ ...o, status: 'Delivered' as OrderStatus }) : null); 
          // It's better to let the order status from Firestore dictate the "Delivered" state for the timeline.
        }
        return newEta;
      });
      // Simple distance simulation - adjust as needed
      setDistance(prevDist => parseFloat(Math.max(0, (prevDist || 0.5) - 0.15).toFixed(1)));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [order, isLoading, etaMinutes]);


  const orderStatusSteps = useMemo(() => getOrderStatusSteps(order?.status), [order?.status]);

  const renderMap = () => {
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
            <Skeleton className="h-96 w-full mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-40 md:col-span-2" />
                <Skeleton className="h-40" />
            </div>
        </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
            <Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Orders
            </Link>
            </Button>
        </div>
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{pageError ? "Error Loading Order" : "Order Not Found"}</AlertTitle>
          <AlertDescription>
            {pageError || `Details for order ID "${orderIdParam || 'UNKNOWN'}" could not be loaded or the order does not exist.`}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isReturnFlowActive = order.status.toLowerCase().includes('return') || order.status.toLowerCase().includes('refunded');

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
          <Truck className="mr-3 h-8 w-8" /> {isReturnFlowActive ? 'Return Status' : 'Order Tracking'}
        </h1>
        <p className="text-muted-foreground mt-1">Order ID: {orderIdParam?.substring(0,10) || 'N/A'}...</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
         {!isReturnFlowActive && (
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent"/>Delivery Map</CardTitle>
                </CardHeader>
                <CardContent>
                {renderMap()}
                </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-accent"/>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
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
                <p className="text-muted-foreground text-sm text-center py-4">No items to display for this order.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Route className="mr-2 h-5 w-5 text-accent"/>{isReturnFlowActive ? 'Return Progress' : 'Delivery Status'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isReturnFlowActive && (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-lg font-semibold text-primary">
                                <Clock className="mr-2 h-5 w-5"/>
                                ETA: {etaMinutes !== null && etaMinutes > 0 ? `~${etaMinutes} min` : (order.status.toLowerCase() === 'delivered' ? 'Delivered' : (etaMinutes === 0 ? 'Arriving Soon' : 'Calculating...'))}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Navigation className="mr-1 h-4 w-4"/> {distance !== null && distance > 0 ? `${distance} km` : (order.status.toLowerCase() === 'delivered' ? '-' : '...')}
                            </div>
                        </div>
                        <Progress
                            value={
                                order.status.toLowerCase() === 'delivered' ? 100 :
                                (orderStatusSteps.findIndex(s => s.current) / (orderStatusSteps.length - 1)) * 100 ||
                                (orderStatusSteps.filter(s => s.completed).length / (orderStatusSteps.length -1)) * 100
                            }
                            aria-label={`Order status: ${order.status}, ${etaMinutes} minutes remaining`}
                            className="w-full h-2" />
                    </>
                )}

                <div className="space-y-3 mt-3 pt-3 border-t">
                    {orderStatusSteps.map((step, index) => (
                        <div key={index} className={`flex items-center gap-2 ${step.completed ? 'text-green-600' : 'text-muted-foreground'} ${step.current ? 'font-semibold text-primary animate-pulse' : ''}`}>
                           <step.icon className={`h-5 w-5 ${step.completed ? 'text-green-600' : step.current ? 'text-primary' : 'text-muted-foreground/70'}`}/>
                            <span>{step.name}</span>
                        </div>
                    ))}
                </div>
                <Separator/>
                 <p className="text-sm">Current Status: <span className="font-semibold text-primary">{order.status}</span></p>
                 <p className="text-xs text-muted-foreground">Last updated: {new Date(order.orderDate).toLocaleTimeString()}</p>
            </CardContent>
          </Card>

         {!isReturnFlowActive && assignedDeliveryPartner && (
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-accent"/>
                        Delivery Partner
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <p><strong>{assignedDeliveryPartner.name}</strong></p>
                    <p className="text-xs text-muted-foreground">Phone: {assignedDeliveryPartner.phoneNumber}</p>
                    {assignedDeliveryPartner.vehicleDetails && <p className="text-xs text-muted-foreground">Vehicle: {assignedDeliveryPartner.vehicleDetails}</p>}
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => alert(`Contacting ${assignedDeliveryPartner.name} at ${assignedDeliveryPartner.phoneNumber} (Feature not implemented)`)}>
                        <Phone className="mr-1.5 h-3.5 w-3.5"/> Contact Rider
                    </Button>
                </CardContent>
            </Card>
         )}
         {!isReturnFlowActive && !assignedDeliveryPartner && (
            <Card className="shadow-md">
                 <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <UserCheck className="mr-2 h-5 w-5 text-muted-foreground"/>
                        Delivery Partner
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Awaiting delivery partner assignment...</p>
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
    
    
