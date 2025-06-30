
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, UserCheck, HelpCircle, Phone, AlertTriangle, Info, CheckCircle, Circle, Heart } from 'lucide-react';
import type { Order as OrderType, OrderStatus, OrderItem as OrderItemType, OrderAddress } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const ORDER_STATUS_SEQUENCE: OrderStatus[] = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];

const getOrderStatusSteps = (currentStatus: OrderStatus | undefined) => {
  const steps: { name: OrderStatus; completed: boolean; current: boolean; icon: React.ElementType }[] = ORDER_STATUS_SEQUENCE.map(statusName => ({
    name: statusName,
    completed: false,
    current: false,
    icon: Circle,
  }));

  if (!currentStatus) {
    steps[0].current = true;
    steps[0].icon = Clock;
    return steps;
  }

  const currentStatusLower = currentStatus.toLowerCase();
  let currentIndex = ORDER_STATUS_SEQUENCE.findIndex(s => s.toLowerCase() === currentStatusLower);

  if (currentIndex === -1) {
    if (currentStatusLower.includes('shipped') || currentStatusLower.includes('out for delivery')) currentIndex = 3;
    else if (currentStatusLower.includes('confirmed')) currentIndex = 1;
    else if (currentStatusLower.includes('processing')) currentIndex = 2;
    else if (currentStatusLower.includes('placed')) currentIndex = 0;
    else if (currentStatusLower.includes('delivered')) currentIndex = 4;
    else currentIndex = 0;
  }

  return steps.map((step, index) => {
    const completed = index < currentIndex || (index === currentIndex && currentStatusLower === 'delivered');
    const current = index === currentIndex && !completed;
    let icon = Circle;
    if (completed) icon = CheckCircle;
    else if (current) icon = Clock;
    if (current && step.name === 'Out for Delivery') icon = Truck;

    return { ...step, completed, current, icon };
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
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  useEffect(() => {
    if (!orderIdParam) {
      setPageError("Order ID is missing in the URL.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const orderRef = doc(db, "orders", orderIdParam);
    const unsubscribe = onSnapshot(orderRef, async (orderSnap) => {
      if (orderSnap.exists()) {
        const data = orderSnap.data();
        const fetchedOrder: OrderType = {
          id: orderSnap.id,
          userId: data.userId,
          items: data.items as OrderItemType[],
          totalAmount: data.totalAmount,
          status: data.orderStatus as OrderStatus,
          deliveryAddress: data.address as OrderAddress,
          orderDate: (data.orderDate as Timestamp)?.toDate().toISOString(),
          estimatedDeliveryTime: (data.estimatedDeliveryTime as Timestamp)?.toDate().toISOString(),
          deliveryPartnerId: data.deliveryPartnerId || null,
          paymentMethod: data.paymentMethod,
        };
        setOrder(fetchedOrder);

        if (fetchedOrder.deliveryPartnerId) {
          try {
            const partnerRef = doc(db, "users", fetchedOrder.deliveryPartnerId);
            const partnerSnap = await getDoc(partnerRef);
            if (partnerSnap.exists()) {
              const partnerData = partnerSnap.data();
              setAssignedDeliveryPartner({
                name: partnerData.name || "N/A",
                phoneNumber: partnerData.phoneNumber || "N/A",
                vehicleDetails: partnerData.vehicleDetails || undefined,
              });
            }
          } catch (partnerError) {
            console.error("Error fetching delivery partner:", partnerError);
          }
        } else if (fetchedOrder.status.toLowerCase() === 'out for delivery') {
            setAssignedDeliveryPartner({ name: 'Shekhar', phoneNumber: '+91-1234567890', vehicleDetails: 'Bike - BR01XY1234' });
        } else {
            setAssignedDeliveryPartner(null);
        }

      } else {
        setPageError(`Order with ID ${orderIdParam} not found.`);
      }
      setIsLoading(false);
    }, (error) => {
      setPageError(`Failed to fetch order details: ${error.message || "Please try again."}`);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [orderIdParam]);
  
  useEffect(() => {
    if (!order?.estimatedDeliveryTime || order.status.toLowerCase() === 'delivered') {
      setEtaMinutes(0);
      return;
    }

    const updateEta = () => {
      const estimatedDelivery = new Date(order.estimatedDeliveryTime!);
      const now = new Date();
      const remainingMs = estimatedDelivery.getTime() - now.getTime();
      const newEta = Math.max(0, Math.round(remainingMs / 60000));
      setEtaMinutes(newEta);
    };

    updateEta();
    const intervalId = setInterval(updateEta, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [order]);


  const orderStatusSteps = useMemo(() => getOrderStatusSteps(order?.status), [order?.status]);
  const isOrderActive = order && !['delivered', 'cancelled', 'failed'].includes(order.status.toLowerCase());

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

  if (pageError || !order) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{pageError ? "Error Loading Order" : "Order Not Found"}</AlertTitle>
          <AlertDescription>{pageError || `Details for order ID "${orderIdParam}" could not be loaded.`}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>
      
      <Card className="bg-green-600 text-white shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {order.status.toLowerCase() === 'delivered' ? 'Order Delivered!' : 'Order is on the way'}
          </CardTitle>
          {isOrderActive && etaMinutes !== null && (
            <CardDescription className="text-green-200 text-lg">
              Arriving in {etaMinutes > 0 ? `${etaMinutes} minutes` : 'moments...'}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-accent" />Delivery Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '350px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57302.63291536073!2d85.86197830599366!3d26.15062508977816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb835434acdb1%3A0x70ec31d04822699e!2sDarbhanga%2C%20Bihar!5e0!3m2!1sen!2sin!4v1749675032868!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border:0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Delivery Map" data-ai-hint="static map embed"
                ></iframe>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-accent"/>Order Items</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0">
                    <Image src={item.imageUrl || ''} alt={item.name} width={50} height={50} className="rounded object-cover aspect-square border" data-ai-hint="order item track" />
                    <div className="flex-grow"><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div>
                    <p className="text-sm font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="text-right"><p className="text-lg font-bold">Total: ₹{order.totalAmount.toFixed(2)}</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-24">
            {assignedDeliveryPartner && (
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><Truck className="mr-2 h-5 w-5 text-accent"/>Delivery Partner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p>I'm <strong>{assignedDeliveryPartner.name}</strong>, your delivery partner</p>
                        <p className="text-xs text-muted-foreground italic">"I have picked up your order, and I am on the way to your location"</p>
                        {assignedDeliveryPartner.vehicleDetails && <p className="text-xs text-muted-foreground">Vehicle: {assignedDeliveryPartner.vehicleDetails}</p>}
                        <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                            <Phone className="mr-1.5 h-3.5 w-3.5"/> Contact Rider
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg flex items-center"><Heart className="mr-2 h-5 w-5 text-accent"/>Tip Your Rider</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Delivering happiness at your doorstep! Thank them by leaving a tip.</p>
                    <div className="grid grid-cols-4 gap-2">
                        {[20, 30, 50, 'Custom'].map(tip => (
                            <Button 
                                key={tip} 
                                variant={selectedTip === tip ? 'default' : 'outline'}
                                onClick={() => setSelectedTip(tip === 'Custom' ? 0 : tip as number)}
                                className={cn("text-xs", selectedTip === 30 && tip === 30 ? "relative" : "")}
                            >
                                {tip === 30 && <span className="absolute -top-2 -right-2 text-white bg-green-500 text-[8px] px-1 rounded-full">Most Tipped</span>}
                                {tip === 'Custom' ? tip : `₹${tip}`}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md bg-secondary/30">
                <CardContent className="p-4 space-y-1">
                    <p className="text-sm font-semibold">Your SpeedyShop darkstore is only 0.5 km away.</p>
                    <Link href="#" className="text-xs text-primary hover:underline">Learn about delivery partner safety →</Link>
                </CardContent>
            </Card>

            {order.paymentMethod === 'cod' && (
                <Alert>
                    <AlertTitle>Payment Reminder</AlertTitle>
                    <AlertDescription>Please pay ₹{order.totalAmount.toFixed(2)} before or on delivery.</AlertDescription>
                </Alert>
            )}

            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-accent"/>Need Help?</CardTitle></CardHeader>
                <CardContent><Button variant="outline" className="w-full" asChild><Link href="/support">Contact Support</Link></Button></CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
