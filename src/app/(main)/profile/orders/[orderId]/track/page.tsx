
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, Navigation, Home, Route, HelpCircle, Phone, AlertTriangle } from 'lucide-react';
// import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api'; // Temporarily commented out
import { mockOrders, mockDeliveryPartners } from '@/lib/mockData'; 
import type { Order as OrderType, DeliveryPartner as DeliveryPartnerType, OrderAddress, OrderStatus } from '@/lib/types'; 
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// const containerStyle = { // Temporarily commented out
//   width: '100%',
//   height: '400px',
//   borderRadius: '0.5rem',
// };

const MOCK_CUSTOMER_LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
  'order001': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  'order002': { lat: 28.7041, lng: 77.1025 }, // Delhi
  'order003': { lat: 12.9716, lng: 77.5946 }, // Bangalore
  'default': { lat: 20.5937, lng: 78.9629 } 
};

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
  else if (statusLower.includes('confirmed')) completedIndex = 1; // Changed from || placed
  else if (statusLower.includes('placed')) completedIndex = 0;


  return steps.map((step, index) => ({
    ...step,
    completed: index <= completedIndex,
    current: index === completedIndex && index !==4 // Don't mark 'Delivered' as current in the same way
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

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      const foundOrder = mockOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        const partner = mockDeliveryPartners.find(dp => dp.id === foundOrder.deliveryPartnerId);
        setDeliveryPartner(partner || mockDeliveryPartners[0]); 

        // Initialize ETA and distance based on order or defaults
        // This is a rough estimation for mock purposes
        const orderDate = new Date(foundOrder.orderDate);
        const estimatedDelivery = foundOrder.estimatedDeliveryTime ? new Date(foundOrder.estimatedDeliveryTime) : new Date(orderDate.getTime() + 30 * 60000); // Default 30 mins
        const now = new Date();
        const remainingMinutes = Math.max(0, Math.round((estimatedDelivery.getTime() - now.getTime()) / 60000));
        
        if (foundOrder.status.toLowerCase() === 'delivered') {
            setEta(0);
            setDistance(0);
        } else if (foundOrder.status.toLowerCase() === 'cancelled' || foundOrder.status.toLowerCase() === 'failed') {
            setEta(0); // Or some indicator of no ETA
            setDistance(0);
        }
        else if (remainingMinutes > 0) {
            setEta(remainingMinutes);
            // Mock distance based on ETA (e.g., 1 min ~ 0.3-0.5 km for city delivery)
            setDistance(parseFloat(Math.max(0.1, remainingMinutes * 0.35).toFixed(1)));
        } else {
            // If estimated time has passed but not delivered, show a small ETA or "Arriving Soon"
            setEta(foundOrder.status.toLowerCase().includes('out for delivery') ? 5 : 10); 
            setDistance(foundOrder.status.toLowerCase().includes('out for delivery') ? 1.5 : 3.0);
        }

      } else {
        // Order not found, redirect or show error
        router.push('/profile/orders'); // Or a dedicated 404 page
      }
      setIsLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!order || ['Delivered', 'Cancelled', 'Failed'].includes(order.status as string)) {
      return; // Stop simulation if order is completed or failed
    }

    const simulationInterval = setInterval(() => {
      setEta(prevEta => {
        const newEta = Math.max(0, prevEta - 1);
        if (newEta === 0 && order.status !== 'Delivered') {
          // Simulate arrival
          setOrder(o => o ? ({ ...o, status: 'Delivered' as OrderStatus }) : null);
        }
        return newEta;
      });
      setDistance(prevDistance => parseFloat(Math.max(0, prevDistance - 0.35).toFixed(1)));
    }, 5000); // Simulate update every 5 seconds

    return () => clearInterval(simulationInterval);
  }, [order]);


  const orderStatusSteps = useMemo(() => order ? getOrderStatusSteps(order.status) : [], [order]);

  if (isLoading || !order) {
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
        <p className="text-muted-foreground mt-1">Order ID: {order.id.substring(0,10)}...</p>
      </header>

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
                <ul className="space-y-3">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0">
                            {/* Assuming item might not have imageUrl; using placeholder logic */}
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
                        ETA: {eta > 0 ? `~${eta} min` : (order.status === 'Delivered' ? 'Delivered' : 'Arriving Soon')}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Navigation className="mr-1 h-4 w-4"/> {distance > 0 ? `${distance} km` : '-'}
                    </div>
                </div>
                <Progress 
                    value={order.status === 'Delivered' ? 100 : (orderStatusSteps.filter(s => s.completed).length / (orderStatusSteps.length -1)) * 100} 
                    aria-label={`Order status: ${order.status}, ${eta} minutes remaining`} 
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
                 <p className="text-sm">Current Status: <span className="font-semibold text-primary">{order.status}</span></p>
                 <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>

            </CardContent>
          </Card>

          {deliveryPartner && (
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

