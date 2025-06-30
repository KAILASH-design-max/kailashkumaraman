
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@/lib/types';
import { ChevronLeft, ShoppingBag, AlertCircle, Package, MapPin, CreditCard, Loader2, CheckCircle, Phone, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

interface AddressInfo {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
interface FinalOrderData {
  address: AddressInfo;
  method: string; 
  promoCode: { code: string; discountAmount: number; description: string } | null;
  summary: { subtotal: number; discount: number; deliveryCharge: number; gstAmount: number; handlingCharge: number; totalAmount: number };
  cartItems: CartItemType[];
  paymentDetails: {
    method: string;
    details: any;
  };
}

export default function FinalReviewPage() {
  const { cartItems: contextCartItems, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [finalOrderData, setFinalOrderData] = useState<FinalOrderData | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (contextCartItems.length === 0 && !localStorage.getItem('finalOrderData')) {
      router.push('/cart');
      return;
    }
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('finalOrderData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData) as FinalOrderData;
                setFinalOrderData({ ...parsedData, cartItems: contextCartItems.length > 0 ? contextCartItems : parsedData.cartItems });

            } catch (e) {
                console.error("Error parsing final order data from localStorage", e);
                setPageError("Could not load order details. Please go back and try again.");
                router.push('/checkout/payment-details');
            }
        } else if (contextCartItems.length > 0) {
            setPageError("Order details are incomplete. Please proceed through checkout again.");
        }
    }
  }, [contextCartItems, router]);

  const handlePlaceOrder = async () => {
    const currentUser = auth.currentUser;
    if (!finalOrderData) {
        setPageError("Cannot place order, data is missing. Please go back through checkout.");
        return;
    }
    if (!currentUser) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to place an order. Redirecting to login...",
            variant: "destructive",
        });
        router.push('/login?redirect=/checkout/final-review');
        return;
    }

    setIsPlacingOrder(true);
    setPageError(null);

    const estimatedDeliveryDate = new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now for simulation

    const orderDataToSave = {
        userId: String(currentUser.uid),
        name: String(finalOrderData.address?.name || "N/A"),
        phoneNumber: String(finalOrderData.address?.phoneNumber || "N/A"),
        address: {
            street: String(finalOrderData.address?.street || ""),
            city: String(finalOrderData.address?.city || ""),
            postalCode: String(finalOrderData.address?.postalCode || ""),
            country: String(finalOrderData.address?.country || ""),
            name: String(finalOrderData.address?.name || "N/A"), 
            phoneNumber: String(finalOrderData.address?.phoneNumber || "N/A"), 
        },
        items: (finalOrderData.cartItems || []).map(item => ({
            productId: String(item.id),
            name: String(item.name),
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            imageUrl: String(item.images?.[0] || 'https://placehold.co/60x60.png')
        })),
        totalAmount: Number(finalOrderData.summary?.totalAmount) || 0,
        orderStatus: 'Placed',
        orderDate: serverTimestamp(),
        estimatedDeliveryTime: Timestamp.fromDate(estimatedDeliveryDate),
        deliveryPartnerId: null, // Initially null, to be assigned later
        shippingMethod: String(finalOrderData.method || "standard"),
        paymentMethod: String(finalOrderData.paymentDetails?.method || "unknown"),
        promoCodeApplied: finalOrderData.promoCode?.code ? String(finalOrderData.promoCode.code) : null,
        discountAmount: Number(finalOrderData.summary?.discount) || 0,
        deliveryCharge: Number(finalOrderData.summary?.deliveryCharge) || 0,
        gstAmount: Number(finalOrderData.summary?.gstAmount) || 0,
        handlingCharge: Number(finalOrderData.summary?.handlingCharge) || 0,
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderDataToSave);
      console.log("Order placed and saved to Firestore with ID: ", docRef.id);

      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Thank you for your purchase. Redirecting to confirmation...`,
        variant: "default",
        duration: 3000,
      });
      router.push(`/checkout/order-confirmation?orderId=${docRef.id}`);
    } catch (error) {
        console.error("Error placing order / saving to Firestore: ", error);
        setPageError("There was an issue placing your order. Please try again. If the problem persists, contact support.");
        toast({
            title: "Order Placement Failed",
            description: "Could not save your order. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsPlacingOrder(false);
    }
  };

  if (!finalOrderData && !pageError && contextCartItems.length > 0) { 
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground mt-2">Loading order details...</p>
      </div>
    );
  }
  
  if (pageError && !isPlacingOrder) { 
     return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-destructive mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Error</h1>
        <p className="text-destructive mb-8">{pageError}</p>
        <Button onClick={() => router.push('/checkout/payment-details')}>Go Back to Payment</Button>
      </div>
    );
  }
  
  if (!finalOrderData) {
     return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Missing Order Data</h1>
        <p className="text-muted-foreground mb-8">Could not load complete order details. Please start checkout again.</p>
        <Button onClick={() => router.push('/cart')}>Start Checkout</Button>
      </div>
    );
  }

  const { address, method: shippingMethod, promoCode, summary, paymentDetails } = finalOrderData;
  const displayCartItems = finalOrderData.cartItems || [];


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/checkout/payment-details" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Payment Details
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Final Review & Place Order</h1>
      <p className="text-muted-foreground text-center mb-8">Please review all details before confirming your order.</p>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center"><Package className="mr-3 h-6 w-6 text-primary"/>Items in Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {displayCartItems.map((item: CartItemType) => {
                        const imageUrl = item.images?.[0] || 'https://placehold.co/60x60.png';
                        const imageHint = item.dataAiHint || 'review item';
                        return (
                        <div key={item.id} className="flex items-center p-3 gap-3 border rounded-lg">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border">
                                <Image src={imageUrl} alt={item.name} fill sizes="64px" className="object-cover" data-ai-hint={imageHint} />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="font-semibold text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        );
                    })}
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary"/>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>{address?.name || 'N/A'}</strong></p>
                    <p>{address?.street || 'N/A'}</p>
                    <p>{address?.city || 'N/A'}, {address?.postalCode || 'N/A'}, {address?.country || 'N/A'}</p>
                    <p className="flex items-center mt-1"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/> {address?.phoneNumber || 'N/A'}</p>
                    <Separator className="my-3"/>
                    <p className="text-sm text-muted-foreground">Shipping Method: <span className="font-medium text-foreground">{(shippingMethod || 'N/A').charAt(0).toUpperCase() + (shippingMethod || 'N/A').slice(1)}</span></p>
                </CardContent>
            </Card>
             
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        {paymentDetails?.method === 'cod' ? <Coins className="mr-3 h-6 w-6 text-primary"/> : <CreditCard className="mr-3 h-6 w-6 text-primary"/>}
                        Payment Method
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {paymentDetails?.method === 'cod' && (
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                    )}
                    {paymentDetails?.method !== 'cod' && (
                      <p>Method: <span className="font-medium text-foreground">{(paymentDetails?.method || 'unknown').replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span></p>
                    )}
                    {paymentDetails?.method === 'saved' && paymentDetails?.details && (
                        <p>Details: {paymentDetails.details.displayName}</p>
                    )}
                    {paymentDetails?.method === 'new_card' && paymentDetails?.details && (
                        <p>Card: **** **** **** {String(paymentDetails.details.number || '').slice(-4)} ({String(paymentDetails.details.name || '')})</p>
                    )}
                    {paymentDetails?.method === 'upi' && paymentDetails?.details && (
                        <p>UPI ID: {String(paymentDetails.details.upiId || '')}</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{(summary?.subtotal || 0).toFixed(2)}</span></div>
                
                {promoCode && (
                <div className="flex justify-between text-green-600">
                    <span>Discount ({promoCode.code}):</span>
                    <span>-₹{(summary?.discount || 0).toFixed(2)}</span>
                </div>
                )}
                {(summary?.deliveryCharge || 0) > 0 && <div className="flex justify-between text-muted-foreground"><span>Delivery Charge:</span><span>₹{(summary?.deliveryCharge || 0).toFixed(2)}</span></div>}
                {(summary?.subtotal || 0) > 0 && (
                    <>
                        <div className="flex justify-between text-muted-foreground"><span>GST (18% on ₹{(summary?.subtotal || 0).toFixed(2)}):</span><span>₹{(summary?.gstAmount || 0).toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Handling Charge:</span><span>₹{(summary?.handlingCharge || 0).toFixed(2)}</span></div>
                    </>
                )}
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-base"><span>Total Amount:</span><span>₹{(summary?.totalAmount || 0).toFixed(2)}</span></div>
                 {pageError && isPlacingOrder && ( 
                    <p className="text-destructive text-xs mt-2">{pageError}</p>
                 )}
            </CardContent>
            <CardFooter>
                <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handlePlaceOrder} 
                    disabled={isPlacingOrder || displayCartItems.length === 0 || (summary?.totalAmount || 0) <= 0}
                >
                {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                {isPlacingOrder ? 'Placing Order...' : (paymentDetails?.method === 'cod' ? 'Place Order (COD)' : 'Place Order & Pay')}
                </Button>
            </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
