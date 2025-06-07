
'use client';

import { useState, useEffect } from 'react';
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
import { CheckCircle, Package, MapPin, CreditCard, Edit3, PlusCircle, Trash2, ChevronLeft } from 'lucide-react';

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

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('verifyItems');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Shipping state
  const [shippingOption, setShippingOption] = useState('saved'); // 'saved' or 'new'
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || '');
  const [newAddress, setNewAddress] = useState({ street: '', city: '', postalCode: '', country: '' });
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard', 'express', 'pickup'

  // Payment state
  const [paymentOption, setPaymentOption] = useState('saved'); // 'saved' or 'new'
  const [selectedPaymentId, setSelectedPaymentId] = useState(savedPaymentMethods[0]?.id || '');
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' });
  const [giftCard, setGiftCard] = useState('');

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0 ? DELIVERY_CHARGE_AMOUNT : 0;
  const gstAmount = subtotal * GST_RATE;
  const totalAmount = subtotal + deliveryCharge + gstAmount + HANDLING_CHARGE;

  useEffect(() => {
    // If cart is empty and order not placed, redirect to cart (or products)
    if (cartItems.length === 0 && !orderPlaced) {
      window.location.href = '/cart'; // Simple redirect for prototype
    }
  }, [cartItems, orderPlaced]);

  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log('Order placed with details:', {
      items: cartItems,
      shippingAddress: shippingOption === 'saved' ? savedAddresses.find(a => a.id === selectedAddressId) : newAddress,
      shippingMethod,
      paymentMethod: paymentOption === 'saved' ? savedPaymentMethods.find(p => p.id === selectedPaymentId) : newCard,
      giftCard,
      totalAmount,
    });
    setOrderPlaced(true);
    setCurrentStep('confirmation');
    clearCart(); // Clear cart after order
  };
  
  if (orderPlaced) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase at SpeedyShop Proto.</p>
        <p className="text-muted-foreground mb-6">Your order ID is <span className="font-medium text-primary">SSP-{Date.now().toString().slice(-6)}</span>. You will receive an email confirmation shortly.</p>
        
        <Card className="text-left max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><Package className="inline mr-2 h-4 w-4 text-primary"/>Track your order status in <Link href="/profile/orders" className="font-medium text-primary hover:underline">your account</Link>.</p>
            <p><Edit3 className="inline mr-2 h-4 w-4 text-primary"/>Contact support for urgent changes or inquiries.</p>
            <p><MapPin className="inline mr-2 h-4 w-4 text-primary"/>Prepare for delivery: keep an eye on shipping notifications.</p>
          </CardContent>
        </Card>
        
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
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

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible value={currentStep} onValueChange={setCurrentStep} className="w-full">
          {/* Step 1: Verify Items */}
          <AccordionItem value="verifyItems">
            <AccordionTrigger className="text-xl font-semibold">
              <Package className="mr-3 h-6 w-6 text-primary" /> Step 1: Verify Your Items
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <p className="text-muted-foreground">Please review your cart contents, quantities, and prices before proceeding.</p>
              {cartItems.map((item: CartItem) => (
                <Card key={item.id} className="flex items-center p-3 gap-3">
                  <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={item.dataAiHint || 'checkout item'} />
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </Card>
              ))}
              <Separator />
              <div className="text-right font-semibold text-lg">
                Subtotal: ${subtotal.toFixed(2)}
              </div>
              <Button onClick={() => setCurrentStep('shippingSelection')} className="w-full sm:w-auto float-right">Next: Shipping</Button>
            </AccordionContent>
          </AccordionItem>

          {/* Step 2: Shipping Selection */}
          <AccordionItem value="shippingSelection">
            <AccordionTrigger className="text-xl font-semibold">
              <MapPin className="mr-3 h-6 w-6 text-primary" /> Step 2: Shipping Details
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
              <h3 className="text-lg font-medium">Choose Delivery Address</h3>
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-2">
                <div>
                  <RadioGroupItem value="saved" id="savedAddr" />
                  <Label htmlFor="savedAddr" className="ml-2">Use a saved address</Label>
                </div>
                {shippingOption === 'saved' && (
                  <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a saved address" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map(addr => (
                        <SelectItem key={addr.id} value={addr.id}>{addr.name} - {addr.street}, {addr.city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div>
                  <RadioGroupItem value="new" id="newAddr" />
                  <Label htmlFor="newAddr" className="ml-2">Enter a new address</Label>
                </div>
              </RadioGroup>

              {shippingOption === 'new' && (
                <div className="space-y-3 p-4 border rounded-md">
                  <Input placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    <Input placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} />
                  </div>
                  <Input placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                </div>
              )}

              <h3 className="text-lg font-medium pt-4">Select Shipping Method</h3>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Est. 3-5 days)</SelectItem>
                  <SelectItem value="express">Express (Est. 1-2 days) - $10.00</SelectItem>
                  <SelectItem value="pickup">In-Store Pickup (Today)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setCurrentStep('paymentProcess')} className="w-full sm:w-auto float-right mt-4">Next: Payment</Button>
            </AccordionContent>
          </AccordionItem>

          {/* Step 3: Payment Process */}
          <AccordionItem value="paymentProcess">
            <AccordionTrigger className="text-xl font-semibold">
              <CreditCard className="mr-3 h-6 w-6 text-primary" /> Step 3: Payment
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
              <h3 className="text-lg font-medium">Choose Payment Method</h3>
               <RadioGroup value={paymentOption} onValueChange={setPaymentOption} className="space-y-2">
                <div>
                  <RadioGroupItem value="saved" id="savedPay" />
                  <Label htmlFor="savedPay" className="ml-2">Use a saved payment method</Label>
                </div>
                {paymentOption === 'saved' && (
                  <Select value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a saved payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedPaymentMethods.map(pay => (
                        <SelectItem key={pay.id} value={pay.id}>{pay.type} ending in {pay.last4}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div>
                  <RadioGroupItem value="new" id="newPay" />
                  <Label htmlFor="newPay" className="ml-2">Add a new card</Label>
                </div>
              </RadioGroup>

              {paymentOption === 'new' && (
                <div className="space-y-3 p-4 border rounded-md">
                  <Input type="tel" placeholder="Card Number (mock)" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="MM/YY (mock)" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} />
                    <Input placeholder="CVV (mock)" value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} />
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium pt-4">Gift Card / Store Credit</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter code" value={giftCard} onChange={e => setGiftCard(e.target.value)} />
                <Button variant="outline">Apply</Button>
              </div>
              <Button onClick={() => setCurrentStep('finalReview')} className="w-full sm:w-auto float-right mt-4">Next: Review Order</Button>
            </AccordionContent>
          </AccordionItem>

          {/* Step 4: Final Review & Place Order */}
          <AccordionItem value="finalReview">
            <AccordionTrigger className="text-xl font-semibold">
              <CheckCircle className="mr-3 h-6 w-6 text-primary" /> Step 4: Final Review & Place Order
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Please review all details before placing your order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                  {deliveryCharge > 0 && <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery:</span><span>${deliveryCharge.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-sm text-muted-foreground"><span>GST (18%):</span><span>${gstAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Handling:</span><span>${HANDLING_CHARGE.toFixed(2)}</span></div>
                  <Separator/>
                  <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${totalAmount.toFixed(2)}</span></div>
                  
                  <Separator className="my-4"/>
                  
                  <div>
                    <h4 className="font-medium mb-1">Shipping to:</h4>
                    {shippingOption === 'saved' && savedAddresses.find(a => a.id === selectedAddressId) ? (
                      <p className="text-sm text-muted-foreground">{savedAddresses.find(a => a.id === selectedAddressId)?.street}, {savedAddresses.find(a => a.id === selectedAddressId)?.city}</p>
                    ) : shippingOption === 'new' && newAddress.street ? (
                      <p className="text-sm text-muted-foreground">{newAddress.street}, {newAddress.city}</p>
                    ) : <p className="text-sm text-destructive">Please select/enter shipping address.</p>}
                  </div>
                   <div>
                    <h4 className="font-medium mb-1">Payment method:</h4>
                    {paymentOption === 'saved' && savedPaymentMethods.find(p => p.id === selectedPaymentId) ? (
                      <p className="text-sm text-muted-foreground">{savedPaymentMethods.find(p => p.id === selectedPaymentId)?.type} ending in {savedPaymentMethods.find(p => p.id === selectedPaymentId)?.last4}</p>
                    ) : paymentOption === 'new' && newCard.number ? (
                      <p className="text-sm text-muted-foreground">New Card ending in {newCard.number.slice(-4)}</p>
                    ) : <p className="text-sm text-destructive">Please select/enter payment method.</p>}
                  </div>

                  <p className="text-xs text-muted-foreground pt-2">Estimated Delivery: 3-5 business days (Standard Shipping). Return policy: 30 days for eligible items. By clicking "Buy Now", you agree to our Terms of Service.</p>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
                    Buy Now (${totalAmount.toFixed(2)})
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
