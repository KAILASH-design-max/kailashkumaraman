
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@/lib/types'; // Renamed to avoid conflict
import { ChevronLeft, ShoppingBag, AlertCircle, Package, MapPin, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinalOrderData {
  address: { name: string; street: string; city: string; postalCode: string; country: string };
  method: string; // Shipping method
  promoCode: { code: string; discountAmount: number; description: string } | null;
  summary: { subtotal: number; discount: number; deliveryCharge: number; gstAmount: number; handlingCharge: number; totalAmount: number };
  cartItems: CartItemType[];
  paymentDetails: {
    method: string; // 'saved', 'new_card', 'upi'
    details: any; // Could be SavedPaymentMethod, newCardDetails, or { upiId: string }
  };
}

export default function FinalReviewPage() {
  const { cartItems, clearCart } = useCart(); // cartItems from useCart is the source of truth for display here
  const router = useRouter();
  const { toast } = useToast();

  const [finalOrderData, setFinalOrderData] = useState<FinalOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0 && !localStorage.getItem('finalOrderData')) { // Check if cart is truly empty AND no order data persisted
      router.push('/cart');
      return;
    }
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('finalOrderData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData) as FinalOrderData;
                // Crucially, override cartItems from localStorage with live cartItems from context
                // This ensures if user went back and changed cart, review page shows current cart
                setFinalOrderData({ ...parsedData, cartItems: cartItems });
            } catch (e) {
                console.error("Error parsing final order data from localStorage", e);
                setPageError("Could not load order details. Please go back and try again.");
                router.push('/checkout/payment-details'); 
            }
        } else if (cartItems.length > 0) { // If no stored data but cart has items, means user jumped here or error
            setPageError("Order details are incomplete. Please proceed through checkout again.");
            // Potentially create a minimal finalOrderData from cart if appropriate, or force back
            // For now, let's assume they must have payment details to reach here.
            // router.push('/checkout/payment-details'); 
        }
    }
  }, [cartItems, router]);

  const handlePlaceOrder = async () => {
    if (!finalOrderData) {
        setPageError("Cannot place order, data is missing.");
        return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    if (typeof window !== 'undefined') {
        localStorage.removeItem('finalOrderData');
        localStorage.removeItem('checkoutShippingInfo'); // Also clear previous step's data
    }
    setIsLoading(false);
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. You'll be redirected shortly.",
      variant: "default", 
      duration: 3000, 
    });
    router.push('/checkout/order-confirmation'); // Redirect to the new order confirmation page
  };

  if (!finalOrderData && !pageError) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }
  
  if (pageError) {
     return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-destructive mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Error</h1>
        <p className="text-destructive mb-8">{pageError}</p>
        <Button onClick={() => router.push('/checkout/payment-details')}>Go Back to Payment</Button>
      </div>
    );
  }
  
  // Derived state from finalOrderData for cleaner rendering
  const { address, method: shippingMethod, promoCode, summary, paymentDetails } = finalOrderData!;
  const displayCartItems = finalOrderData!.cartItems; // Use cartItems from finalOrderData


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
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
            
            <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center"><Package className="mr-3 h-6 w-6 text-primary"/>Items in Your Order</h3>
                <div className="space-y-3">
                {displayCartItems.map((item: CartItemType) => {
                    const primaryImage = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : { url: 'https://placehold.co/60x60.png', dataAiHint: 'review item' };
                    return (
                    <Card key={item.id} className="flex items-center p-3 gap-3 shadow-sm border">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                            <Image src={primaryImage.url} alt={item.name} fill sizes="64px" className="object-cover" data-ai-hint={primaryImage.dataAiHint || item.dataAiHint || 'review item'} />
                        </div>
                        <div className="flex-grow">
                        <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </Card>
                    );
                })}
                </div>
            </section>
            <Separator/>
            <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary"/>Shipping Details</h3>
                <Card className="p-4 border shadow-sm">
                    <p><strong>{address.name}</strong></p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postalCode}, {address.country}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Shipping Method: <span className="font-medium text-foreground">{shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}</span></p>
                </Card>
            </section>
            <Separator/>
             <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary"/>Payment Method</h3>
                <Card className="p-4 border shadow-sm">
                    <p>Method: <span className="font-medium text-foreground">{paymentDetails.method.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span></p>
                    {paymentDetails.method === 'saved' && paymentDetails.details && (
                        <p>Details: {paymentDetails.details.displayName}</p>
                    )}
                    {paymentDetails.method === 'new_card' && paymentDetails.details && (
                        <p>Card: **** **** **** {paymentDetails.details.number.slice(-4)} ({paymentDetails.details.name})</p>
                    )}
                    {paymentDetails.method === 'upi' && paymentDetails.details && (
                        <p>UPI ID: {paymentDetails.details.upiId}</p>
                    )}
                </Card>
            </section>
        </div>

        <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{summary.subtotal.toFixed(2)}</span></div>
                
                {promoCode && (
                <div className="flex justify-between text-green-600">
                    <span>Discount ({promoCode.code}):</span>
                    <span>-₹{promoCode.discountAmount.toFixed(2)}</span>
                </div>
                )}
                {summary.deliveryCharge > 0 && (summary.subtotal - (promoCode?.discountAmount || 0)) > 0 && <div className="flex justify-between text-muted-foreground"><span>Delivery Charge:</span><span>₹{summary.deliveryCharge.toFixed(2)}</span></div>}
                {(summary.subtotal - (promoCode?.discountAmount || 0)) > 0 && (
                    <>
                        <div className="flex justify-between text-muted-foreground"><span>GST (18%):</span><span>₹{summary.gstAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Handling Charge:</span><span>₹{summary.handlingCharge.toFixed(2)}</span></div>
                    </>
                )}
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-base"><span>Total Amount:</span><span>₹{summary.totalAmount.toFixed(2)}</span></div>
            </CardContent>
            <CardFooter>
                <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handlePlaceOrder} 
                    disabled={isLoading || displayCartItems.length === 0 || summary.totalAmount <= 0}
                >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Place Order & Pay
                </Button>
            </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}

