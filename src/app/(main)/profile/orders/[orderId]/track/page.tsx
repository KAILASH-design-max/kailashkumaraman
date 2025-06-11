
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Package, Clock, Truck, Navigation, Home, Route, HelpCircle, Phone, AlertTriangle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { mockOrders, mockDeliveryPartners } from '@/lib/mockData'; // Using mock data
import type { Order as OrderType, DeliveryPartner as DeliveryPartnerType, OrderAddress } from '@/lib/types'; // Adjusted import for OrderType
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

// Mock customer and delivery partner starting locations
// These would typically come from your backend/order data
const MOCK_CUSTOMER_LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
  'order001': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  'order002': { lat: 28.7041, lng: 77.1025 }, // Delhi
  'order003': { lat: 12.9716, lng: 77.5946 }, // Bangalore
  'default': { lat: 20.5937, lng: 78.9629 } // India center (fallback)
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
  else if (statusLower.includes('confirmed') || statusLower.includes('placed')) completedIndex = 1;
  else if (statusLower.includes('placed')) completedIndex = 0;


  return steps.map((step, index) => ({
    ...step,
    completed: index <= completedIndex,
    current: index === completedIndex
  }));
};

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartnerType | null>(null);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [agentLocation, setAgentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<number>(15); // Simulated ETA in minutes
  const [distance, setDistance] = useState<number>(5.2); // Simulated distance in km
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places', 'directions'],
  });

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      // Simulate fetching order data
      const foundOrder = mockOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        const partner = mockDeliveryPartners.find(dp => dp.id === foundOrder.deliveryPartnerId);
        setDeliveryPartner(partner || mockDeliveryPartners[0]); // Fallback DP

        const mockCustLoc = MOCK_CUSTOMER_LOCATIONS[orderId] || MOCK_CUSTOMER_LOCATIONS['default'];
        setCustomerLocation(mockCustLoc);
        
        // Simulate initial agent location slightly offset from customer
        setAgentLocation({ lat: mockCustLoc.lat + 0.05, lng: mockCustLoc.lng + 0.05 });
      } else {
        // Handle order not found
        router.push('/profile/orders');
      }
      setIsLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!isLoaded || !agentLocation || !customerLocation || loadError) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: agentLocation,
        destination: customerLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          // Simulate ETA and distance from directions
          const route = result.routes[0];
          if (route && route.legs[0]) {
            const leg = route.legs[0];
            setEta(Math.round((leg.duration?.value || 900) / 60)); // seconds to minutes
            setDistance(parseFloat(((leg.distance?.value || 5200) / 1000).toFixed(1))); // meters to km
          }
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  }, [isLoaded, agentLocation, customerLocation, loadError]);

  // Simulate agent movement and ETA update
  useEffect(() => {
    if (!order || order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Failed' || loadError) {
      if (order && order.status === 'Delivered' && customerLocation) {
         setAgentLocation(customerLocation); // Agent at customer location if delivered
      }
      return;
    }

    const interval = setInterval(() => {
      setAgentLocation(prev => {
        if (!prev || !customerLocation) return prev;
        // Simple linear interpolation towards customer for simulation
        const newLat = prev.lat - (prev.lat - customerLocation.lat) * 0.1;
        const newLng = prev.lng - (prev.lng - customerLocation.lng) * 0.1;
        // Stop very close to destination
        if (Math.abs(newLat - customerLocation.lat) < 0.0001 && Math.abs(newLng - customerLocation.lng) < 0.0001) {
          clearInterval(interval);
          setOrder(o => o ? ({...o, status: 'Delivered'}) : null);
          return customerLocation;
        }
        return { lat: newLat, lng: newLng };
      });
      setEta(prev => Math.max(1, prev - 1)); // Decrease ETA by 1 min, min 1
      setDistance(prev => Math.max(0.1, parseFloat((prev - 0.5).toFixed(1)))); // Decrease distance
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [order, customerLocation, loadError]);


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
  
  const mapCenter = customerLocation || MOCK_CUSTOMER_LOCATIONS.default;

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
              {loadError && (
                <div className="p-4 rounded-md bg-destructive text-destructive-foreground text-center">
                  <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
                  <p className="font-semibold">Error loading Google Maps.</p>
                  <p className="text-sm mt-1">Please ensure your Google Maps API key is correctly configured, has the necessary APIs enabled (Maps JavaScript API, Directions API), and that there are no billing issues or referrer restrictions blocking access.</p>
                  <p className="text-xs mt-2">({loadError.message})</p>
                </div>
              )}
              {!loadError && isLoaded && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={12}
                >
                  {customerLocation && <MarkerF position={customerLocation} label={{ text: "You", fontWeight: "bold" }} icon={{url: '/home-icon.svg', scaledSize: new google.maps.Size(30,30)}} />}
                  {agentLocation && <MarkerF position={agentLocation} label={{ text: deliveryPartner?.name || "Rider", fontWeight: "bold"}} icon={{url: '/truck-icon.svg', scaledSize: new google.maps.Size(35,35)}} />}
                  {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#4F63AC', strokeWeight: 5 } }} />}
                </GoogleMap>
              )}
              {!loadError && !isLoaded && (
                <Skeleton className="w-full h-[400px] rounded-md" />
              )}
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
                            {item.imageUrl && (
                                <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded object-cover aspect-square border" data-ai-hint="order item track" />
                            )}
                            {!item.imageUrl && (
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
                    <p className="text-lg font-bold">Total: ₹{order.total.toFixed(2)}</p>
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
                        <Clock className="mr-2 h-5 w-5"/> ETA: ~{eta} min
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Navigation className="mr-1 h-4 w-4"/> {distance} km
                    </div>
                </div>
                <Progress value={(15-eta)/15 * 100} aria-label={`${eta} minutes remaining`} className="w-full h-2" />
                
                <div className="space-y-3 mt-3 pt-3 border-t">
                    {orderStatusSteps.map((step, index) => (
                        <div key={index} className={`flex items-center ${step.completed ? 'text-green-600' : 'text-muted-foreground'} ${step.current ? 'font-semibold text-primary' : ''}`}>
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
