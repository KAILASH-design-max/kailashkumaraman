'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, MapPin, Package, Clock, Truck, UserCheck, HelpCircle, Phone, AlertTriangle, Info, CheckCircle, Circle, Heart, ShieldCheck, Users, Handshake, CreditCard, Coins, ListChecks, Star, Loader2 } from 'lucide-react';
import type { Order as OrderType, OrderStatus, OrderItem as OrderItemType, OrderAddress } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, Timestamp, onSnapshot, updateDoc, collection, addDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  rating?: number;
}

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params.orderId as string;
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [assignedDeliveryPartner, setAssignedDeliveryPartner] = useState<AssignedDeliveryPartner | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const [deliveryRating, setDeliveryRating] = useState(0);
  const [hoverDeliveryRating, setHoverDeliveryRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  
  const subtotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [order?.items]);

  useEffect(() => {
    if (!orderIdParam) {
      setPageError("Order ID is missing in the URL.");
      setIsLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(false);
        setPageError("You must be logged in to view this page.");
        router.push(`/login?redirect=/profile/orders/${orderIdParam}/track`);
        return;
      }
      
      setIsLoading(true);
      const orderRef = doc(db, "orders", orderIdParam);
      const orderUnsubscribe = onSnapshot(orderRef, async (orderSnap) => {
        if (orderSnap.exists()) {
          const data = orderSnap.data();

          if (data.userId !== user.uid) {
            setPageError("You are not authorized to view this order.");
            setIsLoading(false);
            return;
          }

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
            deliveryCharge: data.deliveryCharge || 0,
            gstAmount: data.gstAmount || 0,
            handlingCharge: data.handlingCharge || 0,
            discountAmount: data.discountAmount || 0,
            promoCodeApplied: data.promoCodeApplied || null,
          };
          setOrder(fetchedOrder);

          if (fetchedOrder.deliveryPartnerId) {
            try {
              const partnerRef = doc(db, "users", fetchedOrder.deliveryPartnerId);
              const partnerSnap = await getDoc(partnerRef);
              if (partnerSnap.exists()) {
                const partnerData = partnerSnap.data();
                
                let vehicleDetailsString = 'Details not available';
                if (partnerData.vehicleType && partnerData.vehicleRegistrationNumber) {
                    const type = partnerData.vehicleType.charAt(0).toUpperCase() + partnerData.vehicleType.slice(1);
                    vehicleDetailsString = `${type} #${partnerData.vehicleRegistrationNumber.trim()}`;
                } else if (partnerData.vehicleDetails) {
                    vehicleDetailsString = partnerData.vehicleDetails;
                }

                setAssignedDeliveryPartner({
                  name: (partnerData.name || "Delivery Partner").trim(),
                  phoneNumber: partnerData.phoneNumber || "N/A",
                  vehicleDetails: vehicleDetailsString,
                  rating: partnerData.rating || 4.8,
                });
              } else {
                 console.warn(`Delivery partner with ID ${fetchedOrder.deliveryPartnerId} not found, using fallback.`);
                 setAssignedDeliveryPartner({ name: 'Alpha', phoneNumber: '6205480054', vehicleDetails: 'Bike #BR07AP2381', rating: 4.8 });
              }
            } catch (partnerError) {
              console.error("Error fetching delivery partner:", partnerError);
              setAssignedDeliveryPartner({ name: 'Alpha', phoneNumber: '6205480054', vehicleDetails: 'Bike #BR07AP2381', rating: 4.8 });
            }
          } else if (fetchedOrder.status.toLowerCase().includes('out for delivery')) {
              setAssignedDeliveryPartner({ name: 'Alpha', phoneNumber: '6205480054', vehicleDetails: 'Bike #BR07AP2381', rating: 4.8 });
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

      return () => orderUnsubscribe(); // Cleanup Firestore listener
    });

    return () => authUnsubscribe(); // Cleanup Auth listener
  }, [orderIdParam, router]);
  
  useEffect(() => {
    if (!order?.estimatedDeliveryTime || ['delivered', 'cancelled', 'failed'].includes(order.status.toLowerCase())) {
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
    const intervalId = setInterval(updateEta, 30000); 

    return () => clearInterval(intervalId);
  }, [order]);


  const orderStatusSteps = useMemo(() => getOrderStatusSteps(order?.status), [order?.status]);
  const isOrderActive = order && !['delivered', 'cancelled', 'failed'].includes(order.status.toLowerCase());
  
  const isPayNowDisabled = useMemo(() => {
    if (!order?.status) return true;
    const lowerCaseStatus = order.status.toLowerCase();
    return ['delivered', 'cancelled', 'failed'].includes(lowerCaseStatus);
  }, [order?.status]);

  const handlePayNow = async () => {
    if (!order) return;

    // Simulate payment success
    toast({
        title: "✅ Payment successful!",
        description: "You’ve switched to online payment.",
        variant: "default"
    });

    // Simulate updating the order in Firestore
    const orderRef = doc(db, "orders", order.id);
    try {
        await updateDoc(orderRef, {
            paymentMethod: "Online (Paid)",
        });
        // The onSnapshot listener will automatically update the UI.
    } catch (error) {
        console.error("Failed to update payment method:", error);
        toast({
            title: "Update Failed",
            description: "Could not update payment method in the database.",
            variant: "destructive"
        });
    }
  };

  const handleRateDelivery = async () => {
    if (deliveryRating === 0) {
        toast({ title: "Please select a rating.", variant: "destructive" });
        return;
    }
    if (!order?.deliveryPartnerId || !assignedDeliveryPartner) {
        toast({ title: "Error", description: "Delivery partner information is missing.", variant: "destructive" });
        return;
    }

    setIsRatingSubmitting(true);
    try {
        const partnerRef = doc(db, 'users', order.deliveryPartnerId);

        const newRating = {
            orderId: order.id,
            rating: deliveryRating,
            ratedAt: Timestamp.now(),
        };

        await updateDoc(partnerRef, {
            deliveryRatings: arrayUnion(newRating)
        });
        
        toast({ title: "Rating Submitted!", description: "Thank you for your feedback." });
        setIsRatingSubmitted(true);
    } catch (error: any) {
        console.error("Error submitting rating:", error);
        toast({ title: "Submission Failed", description: `Could not submit your rating: ${error.message}`, variant: "destructive" });
    } finally {
        setIsRatingSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 space-y-6">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-24 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-24" />
          </div>
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
          <p className="text-xs text-green-100 pt-1">Order ID: #{order.id.substring(0,10)}...</p>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
        
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-xl"><ListChecks className="mr-2 h-5 w-5 text-accent"/>Order Status</CardTitle>
            </CardHeader>
             <CardContent className="pt-4 overflow-x-auto">
                <div className="flex items-start">
                    {orderStatusSteps.map((step, index) => (
                        <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border-2",
                                    step.completed 
                                        ? "bg-green-600 border-green-600 text-white" 
                                        : step.current 
                                        ? "bg-primary border-primary text-primary-foreground animate-pulse" 
                                        : "border-muted bg-background text-muted-foreground"
                                )}>
                                    <step.icon className="h-5 w-5"/>
                                </div>
                                <p className="text-xs text-center mt-2 w-20">{step.name}</p>
                            </div>
                            {index < orderStatusSteps.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-1 mt-5", 
                                    orderStatusSteps[index + 1].completed || orderStatusSteps[index + 1].current ? 'bg-primary' : 'bg-muted'
                                )} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </CardContent>
          </Card>

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
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Vehicle: {assignedDeliveryPartner.vehicleDetails}</span>
                            <span className="flex items-center">⭐ {assignedDeliveryPartner.rating?.toFixed(1)}</span>
                        </div>
                        
                        {order.status.toLowerCase() !== 'delivered' ? (
                            <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                                <a href={`tel:${assignedDeliveryPartner.phoneNumber}`} className="flex items-center">
                                    <Phone className="mr-1.5 h-3.5 w-3.5"/> Contact Rider
                                </a>
                            </Button>
                        ) : isRatingSubmitted ? (
                            <div className="text-center pt-2 text-green-600 font-semibold flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 mr-2" /> Thanks for your feedback!
                            </div>
                        ) : (
                            <div className="pt-2 border-t mt-3">
                                <h4 className="font-semibold text-center mb-1">Rate Your Delivery Partner</h4>
                                <p className="text-xs text-muted-foreground text-center mb-2">How was your experience with {assignedDeliveryPartner.name}?</p>
                                <div className="flex items-center justify-center mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            onClick={() => setDeliveryRating(star)}
                                            onMouseEnter={() => setHoverDeliveryRating(star)}
                                            onMouseLeave={() => setHoverDeliveryRating(0)}
                                            className={`cursor-pointer h-7 w-7 transition-colors ${
                                            (hoverDeliveryRating || deliveryRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <Button onClick={handleRateDelivery} disabled={isRatingSubmitting} size="sm" className="w-full">
                                    {isRatingSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Rating'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
            
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Bill Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({order.promoCodeApplied})</span><span>-₹{order.discountAmount.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span>Delivery Fee</span><span>₹{order.deliveryCharge.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>GST</span><span>₹{order.gstAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Handling Charge</span><span>₹{order.handlingCharge.toFixed(2)}</span></div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg text-foreground"><span>Total Paid</span><span>₹{order.totalAmount.toFixed(2)}</span></div>
                </CardContent>
             </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-accent"/>
                        Payment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {order.paymentMethod === 'cod' ? (
                        <div className="space-y-4">
                            <Alert>
                                <Coins className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Cash on Delivery Selected</AlertTitle>
                                <AlertDescription>Please pay ₹{order.totalAmount.toFixed(2)} upon delivery.</AlertDescription>
                            </Alert>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2">
                                    ✨ Want to pay now instead?
                                </h4>
                                <Button 
                                    className="w-full"
                                    onClick={handlePayNow}
                                    disabled={isPayNowDisabled}
                                >
                                    Pay Now
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2 px-1">
                                    Secure your order with instant online payment. You'll receive a confirmation once the payment is successful.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="font-medium text-sm">Paid via {(order.paymentMethod || 'Card').replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                    )}
                </CardContent>
            </Card>


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
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-xs text-primary hover:underline cursor-pointer">
                                Learn about delivery partner safety →
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center text-xl">
                                    <ShieldCheck className="mr-2 h-6 w-6 text-primary" /> Delivery Partner Safety
                                </DialogTitle>
                                <DialogDescription>
                                    At SpeedyShop, your safety — and that of our delivery partners — is our top priority.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4 text-sm">
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><UserCheck className="mr-2 h-4 w-4 text-accent"/>Verified & Trained Partners</h3>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                                        <li>Identity verified</li>
                                        <li>Trained on safe driving & hygiene practices</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><CheckCircle className="mr-2 h-4 w-4 text-accent"/>Hygiene Protocols</h3>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                                        <li>Daily health self-checks</li>
                                        <li>Sanitizer kits & masks for every rider</li>
                                        <li>Hygiene-first delivery instructions</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><Users className="mr-2 h-4 w-4 text-accent"/>Respectful Conduct Policy</h3>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                                        <li>Zero tolerance for misbehavior or harassment</li>
                                        <li>24×7 customer support for any complaints</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><HelpCircle className="mr-2 h-4 w-4 text-accent"/>Emergency Support</h3>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                                        <li>Quick-response team via in-app chat/call</li>
                                        <li>Delivery location tracking for safety</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><Package className="mr-2 h-4 w-4 text-accent"/>Contactless Delivery (Optional)</h3>
                                    <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                                        <li>Choose “Leave at Doorstep” during checkout</li>
                                        <li>No-contact, no-cash exchange if prepaid</li>
                                    </ul>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold flex items-center mb-1"><Handshake className="mr-2 h-4 w-4 text-accent"/>Let's Deliver Safely Together</h3>
                                    <p className="text-muted-foreground">We ask you to treat our partners respectfully — they work hard to deliver your order fast & safely.</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-accent"/>Need Help?</CardTitle></CardHeader>
                <CardContent><Button variant="outline" className="w-full" asChild><Link href="/support">Contact Support</Link></Button></CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
