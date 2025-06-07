
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/lib/types';
import { CheckCircle, Package, MapPin, CreditCard, Edit3, PlusCircle, Trash2, ChevronLeft, Tag, AlertCircle, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DELIVERY_CHARGE_THRESHOLD = 299;
const DELIVERY_CHARGE_AMOUNT = 50;
const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

// Mock data for saved addresses and payment methods
const savedAddresses = [
  { id: 'addr1', name: 'Home', street: '123 Main St', city: 'Mumbai', postalCode: '400001', country: 'India' },
  { id: 'addr2', name: 'Work', street: '456 Business Park', city: 'Delhi', postalCode: '110001', country: 'India' },
];

const savedPaymentMethods = [
  { id: 'pay1', type: 'Visa', last4: '1234', expiry: '12/25' },
  { id: 'pay2', type: 'Mastercard', last4: '5678', expiry: '06/26' },
];

interface MockPromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

const mockPromoCodes: MockPromoCode[] = [
  { code: 'SAVE10', type: 'percentage', value: 0.10, description: '10% off your order' },
  { code: 'FLAT50', type: 'fixed', value: 50, description: 'Flat ₹50 off' },
  { code: 'FREEDEL', type: 'fixed', value: DELIVERY_CHARGE_AMOUNT, description: 'Free Delivery (up to ₹50)' },
];


export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('verifyItems');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Shipping state
  const [shippingOption, setShippingOption] = useState('saved');
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || '');
  const [newAddress, setNewAddress] = useState({ name: 'Custom Address', street: '', city: '', postalCode: '', country: '' });
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment state
  const [paymentOption, setPaymentOption] = useState('saved');
  const [selectedPaymentId, setSelectedPaymentId] = useState(savedPaymentMethods[0]?.id || '');
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' });
  
  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);


  const subtotal = getCartTotal();

  const calculatedDiscount = useMemo(() => {
    if (!appliedPromoCode) return 0;
    return appliedPromoCode.discountAmount;
  }, [appliedPromoCode]);
  
  const discountedSubtotal = subtotal - calculatedDiscount;

  const deliveryCharge = useMemo(() => {
    if (appliedPromoCode?.code === 'FREEDEL' && subtotal > 0) return 0; // Free delivery if FREEDEL applied
    return discountedSubtotal < DELIVERY_CHARGE_THRESHOLD && discountedSubtotal > 0 ? DELIVERY_CHARGE_AMOUNT : 0;
  }, [discountedSubtotal, subtotal, appliedPromoCode]);
  
  const gstAmount = discountedSubtotal > 0 ? discountedSubtotal * GST_RATE : 0;
  const totalAmount = discountedSubtotal > 0 ? discountedSubtotal + deliveryCharge + gstAmount + HANDLING_CHARGE : 0;


  const [orderId, setOrderId] = useState<string | null>(null);


  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
        if (typeof window !== 'undefined') {
            window.location.href = '/cart';
        }
    }
  }, [cartItems, orderPlaced]);

  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      setPromoMessage({ type: 'info', text: 'Please enter a promo code.' });
      setAppliedPromoCode(null);
      return;
    }
    const codeToApply = mockPromoCodes.find(pc => pc.code.toUpperCase() === promoCodeInput.trim().toUpperCase());

    if (codeToApply) {
      let discount = 0;
      if (codeToApply.type === 'percentage') {
        discount = subtotal * codeToApply.value;
      } else if (codeToApply.type === 'fixed') {
        discount = codeToApply.value;
        if (codeToApply.code === 'FREEDEL') {
            const actualDeliveryCharge = subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0 ? DELIVERY_CHARGE_AMOUNT : 0;
            discount = Math.min(codeToApply.value, actualDeliveryCharge);
        }
      }
      
      discount = Math.min(discount, subtotal);

      if (discount <= 0 && !(codeToApply.code === 'FREEDEL' && (subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0)) ) {
         setPromoMessage({ type: 'info', text: `Promo code "${codeToApply.code}" cannot be applied or provides no discount for your current cart.` });
         setAppliedPromoCode(null);
      } else {
        setAppliedPromoCode({ code: codeToApply.code, discountAmount: discount, description: codeToApply.description });
        setPromoMessage({ type: 'success', text: `Promo code "${codeToApply.code}" applied! You saved ₹${discount.toFixed(2)}.` });
      }
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid promo code. Please try again.' });
      setAppliedPromoCode(null);
    }
  };


  const handlePlaceOrder = () => {
    const currentOrderId = `SSP-${Date.now().toString().slice(-6)}`;
    setOrderId(currentOrderId);
    console.log('Order placed with details:', {
      orderId: currentOrderId,
      items: cartItems,
      shippingAddress: shippingOption === 'saved' ? savedAddresses.find(a => a.id === selectedAddressId) : newAddress,
      shippingMethod,
      paymentMethod: paymentOption === 'saved' ? savedPaymentMethods.find(p => p.id === selectedPaymentId) : newCard,
      appliedPromoCode,
      subtotal,
      discount: calculatedDiscount,
      deliveryCharge,
      gstAmount,
      handlingCharge: HANDLING_CHARGE,
      totalAmount,
    });
    setOrderPlaced(true);
    setCurrentStep('confirmation');
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase at SpeedyShop.</p>
        <p className="text-muted-foreground mb-6">Your order ID is <span className="font-medium text-primary">{orderId || 'Generating...'}</span>. You will receive an email confirmation shortly.</p>
        <Card className="text-left max-w-md mx-auto mb-8 shadow-lg">
          <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><Package className="inline mr-2 h-4 w-4 text-primary"/>Track your order status in <Link href="/profile/orders" className="font-medium text-primary hover:underline">your account</Link>.</p>
            <p><Edit3 className="inline mr-2 h-4 w-4 text-primary"/>Contact support for urgent changes or inquiries.</p>
            <p><MapPin className="inline mr-2 h-4 w-4 text-primary"/>Prepare for delivery: keep an eye on shipping notifications.</p>
          </CardContent>
        </Card>
        <Button asChild size="lg"><Link href="/products">Continue Shopping</Link></Button>
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
      <h1 className="text-3xl font-bold mb-2 text-center">Secure Checkout</h1>
      <p className="text-muted-foreground text-center mb-8">Complete your purchase in a few simple steps.</p>

      <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        <Accordion type="single" value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <AccordionItem value="verifyItems">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              <div className="flex items-center"><Package className="mr-3 h-6 w-6 text-primary" /> Step 1: Verify Your Items</div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 px-1 space-y-4">
              <p className="text-muted-foreground text-sm">Please review your cart contents, quantities, and prices.</p>
              {cartItems.map((item: CartItem) => {
                const primaryImageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://placehold.co/60x60.png';
                return (
                  <Card key={item.id} className="flex items-center p-3 gap-3 shadow-sm border">
                     <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <Image src={primaryImageUrl} alt={item.name} fill sizes="64px" className="object-cover" data-ai-hint={item.dataAiHint || 'checkout item'} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </Card>
                );
              })}
              <Separator className="my-4"/>
              <div className="text-right font-semibold text-lg">Subtotal: ₹{subtotal.toFixed(2)}</div>
              <Button onClick={() => setCurrentStep('shippingSelection')} className="w-full sm:w-auto float-right mt-2">Next: Shipping Details</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shippingSelection">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
             <div className="flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary" /> Step 2: Shipping Details</div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 px-1 space-y-6">
              <h3 className="text-lg font-medium mb-1">Choose Delivery Address</h3>
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                <div>
                  <RadioGroupItem value="saved" id="savedAddr" /><Label htmlFor="savedAddr" className="ml-2 cursor-pointer">Use a saved address</Label>
                </div>
                {shippingOption === 'saved' && (
                  <Select value={selectedAddressId} onValueChange={setSelectedAddressId} disabled={savedAddresses.length === 0}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={savedAddresses.length > 0 ? "Select a saved address" : "No saved addresses"} /></SelectTrigger>
                    <SelectContent>{savedAddresses.map(addr => (<SelectItem key={addr.id} value={addr.id}>{addr.name} - {addr.street}, {addr.city}</SelectItem>))}</SelectContent>
                  </Select>
                )}
                <div>
                  <RadioGroupItem value="new" id="newAddr" /><Label htmlFor="newAddr" className="ml-2 cursor-pointer">Enter a new address</Label>
                </div>
              </RadioGroup>
              {shippingOption === 'new' && (
                <Card className="p-4 space-y-3 border shadow-sm mt-2">
                  <Input placeholder="Full Name (for this address)" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                  <Input placeholder="Street Address, Apt, Building" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    <Input placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} />
                  </div>
                  <Input placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                </Card>
              )}
              <h3 className="text-lg font-medium pt-4 mb-1">Select Shipping Method</h3>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select shipping method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Est. 3-5 days) - ₹{deliveryCharge.toFixed(2)}</SelectItem>
                  <SelectItem value="express">Express (Est. 1-2 days) - ₹{(deliveryCharge + 50).toFixed(2)}</SelectItem>
                  <SelectItem value="pickup">In-Store Pickup (Today) - Free</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setCurrentStep('paymentProcess')} className="w-full sm:w-auto float-right mt-2">Next: Payment Details</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="paymentProcess">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              <div className="flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary" /> Step 3: Payment Details</div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 px-1 space-y-6">
              <h3 className="text-lg font-medium mb-1">Choose Payment Method</h3>
               <RadioGroup value={paymentOption} onValueChange={setPaymentOption} className="space-y-3">
                <div>
                  <RadioGroupItem value="saved" id="savedPay" /><Label htmlFor="savedPay" className="ml-2 cursor-pointer">Use a saved payment method</Label>
                </div>
                {paymentOption === 'saved' && (
                  <Select value={selectedPaymentId} onValueChange={setSelectedPaymentId} disabled={savedPaymentMethods.length === 0}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={savedPaymentMethods.length > 0 ? "Select a saved payment method" : "No saved payment methods"} /></SelectTrigger>
                    <SelectContent>{savedPaymentMethods.map(pay => (<SelectItem key={pay.id} value={pay.id}>{pay.type} ending in {pay.last4}</SelectItem>))}</SelectContent>
                  </Select>
                )}
                <div><RadioGroupItem value="new" id="newPay" /><Label htmlFor="newPay" className="ml-2 cursor-pointer">Add a new card (Mock)</Label></div>
              </RadioGroup>
              {paymentOption === 'new' && (
                <Card className="p-4 space-y-3 border shadow-sm mt-2">
                  <Input type="tel" autoComplete="cc-number" placeholder="Card Number (e.g., 4444...)" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input autoComplete="cc-exp" placeholder="MM/YY" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} />
                    <Input autoComplete="cc-csc" placeholder="CVV" value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} />
                  </div>
                   <Label htmlFor="saveCardCheckbox" className="text-xs flex items-center gap-2"><input type="checkbox" id="saveCardCheckbox" className="rounded"/> Securely save this card for future use (mock)</Label>
                </Card>
              )}
              <div className="pt-4 space-y-2">
                <Label htmlFor="promoCode" className="text-lg font-medium flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-primary" />Gift Card / Promo Code
                </Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="promoCode" 
                    placeholder="Enter code" 
                    value={promoCodeInput} 
                    onChange={e => setPromoCodeInput(e.target.value)} 
                    className="flex-grow"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Show Promo Codes</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {mockPromoCodes.map((promo) => (
                        <DropdownMenuItem
                          key={promo.code}
                          onClick={() => {
                            setPromoCodeInput(promo.code);
                            setPromoMessage(null); // Clear previous messages
                          }}
                        >
                          {promo.code} - <span className="text-xs text-muted-foreground ml-1">{promo.description}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" onClick={handleApplyPromoCode} className="shrink-0">Apply</Button>
                </div>
                {promoMessage && (
                    <Alert variant={promoMessage.type === 'error' ? 'destructive' : 'default'} className={`text-sm mt-2 ${promoMessage.type === 'success' ? 'border-green-500 bg-green-50 text-green-700 [&>svg]:text-green-700' : promoMessage.type === 'error' ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-500 bg-blue-50 text-blue-700 [&>svg]:text-blue-700'}`}>
                        {promoMessage.type === 'error' && <AlertCircle className="h-4 w-4" />}
                        {promoMessage.type === 'success' && <CheckCircle className="h-4 w-4" />}
                        <AlertDescription>{promoMessage.text}</AlertDescription>
                    </Alert>
                )}
              </div>
              <Button onClick={() => setCurrentStep('finalReview')} className="w-full sm:w-auto float-right mt-4">Next: Review Order</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="finalReview">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              <div className="flex items-center"><CheckCircle className="mr-3 h-6 w-6 text-primary" /> Step 4: Final Review & Place Order</div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 px-1 space-y-6">
              <Card className="shadow-md border">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                  <CardDescription className="text-sm">Please review all details before placing your order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                  
                  {appliedPromoCode && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromoCode.code}):</span>
                      <span>-₹{appliedPromoCode.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {deliveryCharge > 0 && <div className="flex justify-between text-muted-foreground"><span>Delivery Charge:</span><span>₹{deliveryCharge.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-muted-foreground"><span>GST (18% on ₹{discountedSubtotal.toFixed(2)}):</span><span>₹{gstAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Handling Charge:</span><span>₹{HANDLING_CHARGE.toFixed(2)}</span></div>
                  <Separator className="my-2"/>
                  <div className="flex justify-between font-bold text-base"><span>Total Amount:</span><span>₹{totalAmount.toFixed(2)}</span></div>
                  <Separator className="my-3"/>
                  <div>
                    <h4 className="font-medium mb-1">Shipping to:</h4>
                    {shippingOption === 'saved' && savedAddresses.find(a => a.id === selectedAddressId) ? (
                      <p className="text-muted-foreground">{savedAddresses.find(a => a.id === selectedAddressId)?.name} - {savedAddresses.find(a => a.id === selectedAddressId)?.street}, {savedAddresses.find(a => a.id === selectedAddressId)?.city}</p>
                    ) : shippingOption === 'new' && newAddress.street ? (
                      <p className="text-muted-foreground">{newAddress.name} - {newAddress.street}, {newAddress.city}</p>
                    ) : <p className="text-destructive text-xs">Shipping address not selected/entered.</p>}
                  </div>
                   <div>
                    <h4 className="font-medium mb-1 mt-2">Payment method:</h4>
                    {paymentOption === 'saved' && savedPaymentMethods.find(p => p.id === selectedPaymentId) ? (
                      <p className="text-muted-foreground">{savedPaymentMethods.find(p => p.id === selectedPaymentId)?.type} ending in {savedPaymentMethods.find(p => p.id === selectedPaymentId)?.last4}</p>
                    ) : paymentOption === 'new' && newCard.number ? (
                      <p className="text-muted-foreground">New Card ending in {newCard.number.slice(-4)}</p>
                    ) : <p className="text-destructive text-xs">Payment method not selected/entered.</p>}
                  </div>
                  {appliedPromoCode && <p className="text-xs text-green-600 mt-1">Promo code "{appliedPromoCode.code}" applied: {appliedPromoCode.description}</p>}

                  <p className="text-xs text-muted-foreground pt-3">Estimated Delivery: Standard (3-5 days). By clicking "Buy Now", you agree to our Terms of Service & Privacy Policy.</p>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={cartItems.length === 0 || totalAmount <=0 || (shippingOption === 'new' && (!newAddress.street || !newAddress.city || !newAddress.postalCode || !newAddress.country)) || (paymentOption === 'new' && (!newCard.number || !newCard.expiry || !newCard.cvv))}>
                    Buy Now (Pay ₹{totalAmount.toFixed(2)})
                  </Button>
                </CardFooter>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
