
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, CreditCard, ChevronLeft, Tag, AlertCircle, ShoppingBag, Lock, Loader2, Coins } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi';
  displayName: string;
  icon?: React.ElementType;
}

const savedPaymentMethods: SavedPaymentMethod[] = [
  { id: 'card1', type: 'card', displayName: 'Visa ending in 1234', icon: CreditCard },
  { id: 'upi1', type: 'upi', displayName: 'upi@examplebank', icon: CreditCard },
];

interface AddressInfo {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

interface ShippingInfo {
  address: AddressInfo;
  method: string;
  promoCode: { code: string; discountAmount: number; description: string } | null;
  summary: { subtotal: number; discount: number; deliveryCharge: number; gstAmount: number; handlingCharge: number; totalAmount: number };
  cartItems: any[];
}


export default function PaymentDetailsPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentOption, setPaymentOption] = useState('saved');
  const [selectedPaymentId, setSelectedPaymentId] = useState(savedPaymentMethods[0]?.id || '');
  const [newCardDetails, setNewCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [newUpiId, setNewUpiId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    if (typeof window !== 'undefined') {
        const storedInfo = localStorage.getItem('checkoutShippingInfo');
        if (storedInfo) {
            try {
                const parsedInfo = JSON.parse(storedInfo);
                setShippingInfo({ ...parsedInfo, cartItems: cartItems });
            } catch (e) {
                console.error("Error parsing shipping info from localStorage", e);
                setPageError("Could not load shipping details. Please go back and try again.");
                router.push('/cart');
            }
        } else {
            setPageError("Shipping details not found. Please start checkout again.");
            router.push('/cart');
        }
    }
  }, [cartItems, router]);

  const isPaymentDetailsValid = () => {
    if (paymentOption === 'saved') return !!selectedPaymentId;
    if (paymentOption === 'new_card') {
      return newCardDetails.number.trim() !== '' &&
             newCardDetails.expiry.trim() !== '' &&
             newCardDetails.cvc.trim() !== '' &&
             newCardDetails.name.trim() !== '';
    }
    if (paymentOption === 'upi') return newUpiId.trim() !== '';
    if (paymentOption === 'cod') return true; // COD is always valid if selected
    return false;
  };

  const handleProceedToFinalReview = () => {
    if (!shippingInfo) {
        setPageError("Shipping information is missing. Please go back.");
        return;
    }
    if (!isPaymentDetailsValid()){
        setPageError("Please select or enter valid payment details.");
        return;
    }

    let finalPaymentDetailsForStorage: any = null;

    if (paymentOption === 'saved') {
        const foundMethod = savedPaymentMethods.find(p => p.id === selectedPaymentId);
        if (foundMethod) {
            const { icon, ...serializableDetails } = foundMethod; // Omit icon
            finalPaymentDetailsForStorage = serializableDetails;
        }
    } else if (paymentOption === 'new_card') {
        finalPaymentDetailsForStorage = newCardDetails;
    } else if (paymentOption === 'upi') {
        finalPaymentDetailsForStorage = { upiId: newUpiId };
    } else if (paymentOption === 'cod') {
        finalPaymentDetailsForStorage = { type: 'cod' }; // Indicate COD, no further details needed
    }

    const paymentDetails = {
        method: paymentOption,
        details: finalPaymentDetailsForStorage
    };

    const finalOrderData = {
        ...shippingInfo,
        paymentDetails,
    };

    if (typeof window !== 'undefined') {
        localStorage.setItem('finalOrderData', JSON.stringify(finalOrderData));
    }
    console.log("Proceeding to final review with:", finalOrderData);
    router.push('/checkout/final-review');
  };

  if (!shippingInfo && !pageError) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <p className="text-muted-foreground">Loading shipping details...</p>
      </div>
    );
  }

  if (pageError) {
     return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="mx-auto h-24 w-24 text-destructive mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Error</h1>
        <p className="text-destructive mb-8">{pageError}</p>
        <Button onClick={() => router.push('/cart')}>Go Back to Cart</Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Cart
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Payment Details</h1>
      <p className="text-muted-foreground text-center mb-8">Choose your payment method to complete the purchase.</p>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
            <h3 className="text-xl font-semibold flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary" /> Select Payment Method</h3>
            <RadioGroup value={paymentOption} onValueChange={setPaymentOption} className="space-y-3">
              <div>
                <RadioGroupItem value="saved" id="savedPayment" /><Label htmlFor="savedPayment" className="ml-2 cursor-pointer">Use a saved payment method</Label>
              </div>
              {paymentOption === 'saved' && (
                <Select value={selectedPaymentId} onValueChange={setSelectedPaymentId} disabled={savedPaymentMethods.length === 0}>
                  <SelectTrigger className="w-full"><SelectValue placeholder={savedPaymentMethods.length > 0 ? "Select a saved method" : "No saved payment methods"} /></SelectTrigger>
                  <SelectContent>
                    {savedPaymentMethods.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center">
                            {method.icon && <method.icon className="mr-2 h-4 w-4 text-muted-foreground"/>}
                            {method.displayName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <RadioGroupItem value="new_card" id="newCardPayment" /><Label htmlFor="newCardPayment" className="ml-2 cursor-pointer">Add New Credit/Debit Card</Label>
              </div>
              {paymentOption === 'new_card' && (
                <Card className="p-4 space-y-3 border shadow-sm mt-2">
                    <Input placeholder="Cardholder Name" value={newCardDetails.name} onChange={e => setNewCardDetails({...newCardDetails, name: e.target.value})} />
                    <Input placeholder="Card Number (e.g., 1234 5678 1234 5678)" value={newCardDetails.number} onChange={e => setNewCardDetails({...newCardDetails, number: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Expiry Date (MM/YY)" value={newCardDetails.expiry} onChange={e => setNewCardDetails({...newCardDetails, expiry: e.target.value})} />
                        <Input placeholder="CVC/CVV" value={newCardDetails.cvc} onChange={e => setNewCardDetails({...newCardDetails, cvc: e.target.value})} />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Your payment information is encrypted and secure.</span>
                    </div>
                </Card>
              )}
              <div>
                <RadioGroupItem value="upi" id="upiPayment" /><Label htmlFor="upiPayment" className="ml-2 cursor-pointer">UPI / Wallets</Label>
              </div>
              {paymentOption === 'upi' && (
                <Card className="p-4 space-y-3 border shadow-sm mt-2">
                    <Input placeholder="Enter UPI ID (e.g., yourname@okbank)" value={newUpiId} onChange={e => setNewUpiId(e.target.value)} />
                    <p className="text-xs text-muted-foreground">You will be redirected to your UPI app to approve the payment.</p>
                </Card>
              )}
              <div>
                <RadioGroupItem value="cod" id="codPayment" /><Label htmlFor="codPayment" className="ml-2 cursor-pointer flex items-center"><Coins className="mr-2 h-4 w-4 text-muted-foreground" />Cash on Delivery (COD)</Label>
              </div>
              {paymentOption === 'cod' && (
                <Card className="p-4 border shadow-sm mt-2">
                    <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered. Please have the exact amount ready.</p>
                </Card>
              )}
            </RadioGroup>
            <Separator className="my-4"/>
             <p className="text-sm text-muted-foreground italic">
                Clicking "Proceed to Final Review" will take you to the final order confirmation page. No real payment will be processed for this prototype.
            </p>
        </div>

        <div className="lg:col-span-1">
          {shippingInfo && (
            <Card className="shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{shippingInfo.summary.subtotal.toFixed(2)}</span></div>

                {shippingInfo.promoCode && (
                <div className="flex justify-between text-green-600">
                    <span>Discount ({shippingInfo.promoCode.code}):</span>
                    <span>-₹{shippingInfo.summary.discount.toFixed(2)}</span>
                </div>
                )}
                {(shippingInfo.summary.deliveryCharge || 0) > 0 && <div className="flex justify-between text-muted-foreground"><span>Delivery Charge:</span><span>₹{shippingInfo.summary.deliveryCharge.toFixed(2)}</span></div>}
                {shippingInfo.summary.subtotal > 0 && (
                    <>
                        <div className="flex justify-between text-muted-foreground"><span>GST (18% on ₹{shippingInfo.summary.subtotal.toFixed(2)}):</span><span>₹{shippingInfo.summary.gstAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Handling Charge:</span><span>₹{shippingInfo.summary.handlingCharge.toFixed(2)}</span></div>
                    </>
                )}
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-base"><span>Total Amount:</span><span>₹{shippingInfo.summary.totalAmount.toFixed(2)}</span></div>
            </CardContent>
            <CardFooter>
                <Button
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToFinalReview}
                    disabled={isLoading || cartItems.length === 0 || shippingInfo.summary.totalAmount <= 0 || !isPaymentDetailsValid()}
                >
                Proceed to Final Review
                </Button>
            </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
    
