
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
import { CheckCircle, Package, MapPin, CreditCard, Edit3, PlusCircle, Trash2, ChevronLeft, Tag, AlertCircle, ChevronDown, ShoppingBag, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PromoCode } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

const DELIVERY_CHARGE_THRESHOLD = 299;
const DELIVERY_CHARGE_STANDARD = 50;
const DELIVERY_CHARGE_EXPRESS_EXTRA = 50; 
const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

const savedAddresses = [
  { id: 'addr1', name: 'Home', street: '123 Main St', city: 'Mumbai', postalCode: '400001', country: 'India', phoneNumber: '9876543210' },
  { id: 'addr2', name: 'Work', street: '456 Business Park', city: 'Delhi', postalCode: '110001', country: 'India', phoneNumber: '9876543211' },
];


export default function ShippingDetailsPage() {
  const { cartItems, getCartTotal } = useCart();
  const router = useRouter();

  const [shippingOption, setShippingOption] = useState('saved');
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || '');
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', postalCode: '', country: 'India', phoneNumber: '' });
  const [shippingMethod, setShippingMethod] = useState('standard'); 

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const [availablePromoCodes, setAvailablePromoCodes] = useState<PromoCode[]>([]);
  const [promoFetchError, setPromoFetchError] = useState<string | null>(null);


  useEffect(() => {
    if (cartItems.length === 0) {
        router.push('/cart');
    }
    
    async function fetchPromoCodes() {
      setPromoFetchError(null);
      try {
        const promoCodesRef = collection(db, 'promoCodes');
        // Query only by status, as expiresAt is a string in the Firestore schema.
        const q = query(promoCodesRef, where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        const now = new Date();
        const codes: PromoCode[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Firestore 'expiresAt' field is a string, so we parse it.
          const expiresAtDate = new Date(data.expiresAt as string);

          // Client-side filtering for expiration date
          if (expiresAtDate > now) {
              codes.push({
                  id: doc.id,
                  code: data.code,
                  description: data.description,
                  discountType: data.discountType,
                  value: data.value,
                  minOrderValue: data.minOrderValue,
                  status: data.status,
                  expiresAt: data.expiresAt, // keep as string
                  usageLimit: data.usageLimit,
                  // Handle potential Timestamps for other date fields if they exist
                  createdAt: data.createdAt && data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : undefined,
                  updatedAt: data.updatedAt && data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
              });
          }
        });
        setAvailablePromoCodes(codes);
      } catch (e: any) {
        console.error("Error fetching promo codes: ", e);
        if (e.code === 'failed-precondition') {
           setPromoFetchError("A Firestore index is required. Please check the browser console for a link to create it.");
        } else {
           setPromoFetchError("Could not load promo codes at this time.");
        }
      }
    }

    fetchPromoCodes();

  }, [cartItems.length, router]);

  const subtotal = getCartTotal();

  const calculatedDiscount = useMemo(() => {
    if (!appliedPromoCode) return 0;
    return appliedPromoCode.discountAmount;
  }, [appliedPromoCode]);
  
  const deliveryCharge = useMemo(() => {
    if (shippingMethod === 'pickup' || subtotal <= 0) return 0;
    let baseDeliveryCharge = (subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0) ? DELIVERY_CHARGE_STANDARD : 0;
    if (appliedPromoCode?.code === 'FREEDEL' && baseDeliveryCharge > 0) {
        baseDeliveryCharge = Math.max(0, baseDeliveryCharge - appliedPromoCode.discountAmount);
    }
    if (shippingMethod === 'express') {
      return baseDeliveryCharge + DELIVERY_CHARGE_EXPRESS_EXTRA;
    }
    return baseDeliveryCharge;
  }, [subtotal, shippingMethod, appliedPromoCode]);
  
  const gstAmount = useMemo(() => subtotal > 0 ? subtotal * GST_RATE : 0, [subtotal]);
  
  const totalAmount = useMemo(() => {
    const preliminaryTotal = subtotal + gstAmount + deliveryCharge + HANDLING_CHARGE - calculatedDiscount;
    return Math.max(0, preliminaryTotal);
  }, [subtotal, gstAmount, deliveryCharge, HANDLING_CHARGE, calculatedDiscount]);


  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      setPromoMessage({ type: 'info', text: 'Please enter a promo code.' });
      setAppliedPromoCode(null);
      return;
    }
    const codeToApply = availablePromoCodes.find(pc => pc.code.toUpperCase() === promoCodeInput.trim().toUpperCase());

    if (codeToApply) {
      if (codeToApply.minOrderValue && subtotal < codeToApply.minOrderValue) {
        setPromoMessage({ type: 'error', text: `Order subtotal must be at least ₹${codeToApply.minOrderValue} to use ${codeToApply.code}.`});
        setAppliedPromoCode(null);
        return;
      }

      let discount = 0;
      const currentStandardDeliveryCharge = (subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0) ? DELIVERY_CHARGE_STANDARD : 0;

      if (codeToApply.discountType === 'percentage') {
        discount = subtotal * (codeToApply.value / 100);
      } else if (codeToApply.discountType === 'fixed') {
        if (codeToApply.code === 'FREEDEL') {
            discount = Math.min(codeToApply.value, currentStandardDeliveryCharge);
        } else {
            discount = codeToApply.value;
        }
      }
      
      discount = Math.min(discount, subtotal + gstAmount + deliveryCharge + HANDLING_CHARGE); 

      if (discount <= 0 && !(codeToApply.code === 'FREEDEL' && currentStandardDeliveryCharge > 0) ) {
         setPromoMessage({ type: 'info', text: `Promo code "${codeToApply.code}" cannot be applied or provides no discount for your current cart.` });
         setAppliedPromoCode(null);
      } else {
        setAppliedPromoCode({ code: codeToApply.code, discountAmount: discount, description: codeToApply.description || 'Discount applied' });
        setPromoMessage({ type: 'success', text: `Promo code "${codeToApply.code}" applied! You saved ₹${discount.toFixed(2)}.` });
      }
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid or expired promo code. Please try again.' });
      setAppliedPromoCode(null);
    }
  };

  const isAddressValid = () => {
    if (shippingOption === 'saved') return !!selectedAddressId;
    if (shippingOption === 'new') {
      return newAddress.name.trim() !== '' && newAddress.street.trim() !== '' && 
             newAddress.city.trim() !== '' && newAddress.postalCode.trim() !== '' && 
             newAddress.country.trim() !== '' && newAddress.phoneNumber.trim() !== '';
    }
    return false;
  };

  const handleProceedToPayment = () => {
    if (!isAddressValid()) {
        setPromoMessage({ type: 'error', text: 'Please select or enter a valid shipping address, including phone number.'});
        return;
    }
    const currentAddress = shippingOption === 'saved' 
      ? savedAddresses.find(a => a.id === selectedAddressId) 
      : newAddress;

    if (!currentAddress) {
        setPromoMessage({ type: 'error', text: 'Selected address not found.'});
        return;
    }

    const shippingInfo = {
        address: currentAddress, 
        method: shippingMethod,
        promoCode: appliedPromoCode,
        summary: { 
            subtotal, 
            discount: calculatedDiscount, 
            deliveryCharge, 
            gstAmount, 
            handlingCharge: subtotal > 0 ? HANDLING_CHARGE : 0,
            totalAmount 
        }
    };
    if (typeof window !== 'undefined') {
        localStorage.setItem('checkoutShippingInfo', JSON.stringify(shippingInfo));
    }
    router.push('/checkout/payment-details');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Redirecting you to your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/checkout" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Item Review
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Shipping Details</h1>
      <p className="text-muted-foreground text-center mb-8">Provide your shipping address and choose a delivery method.</p>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
            <h3 className="text-xl font-semibold flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary" /> Step 2: Choose Delivery Address</h3>
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
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input type="tel" placeholder="Phone Number" value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} className="pl-10" />
                  </div>
                </Card>
              )}
              <Separator />
              <h3 className="text-lg font-medium pt-4 mb-1">Select Shipping Method</h3>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select shipping method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Est. 3-5 days) - ₹{ ((subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0) ? DELIVERY_CHARGE_STANDARD : 0).toFixed(2) }</SelectItem>
                  <SelectItem value="express">Express (Est. 1-2 days) - ₹{ (((subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0) ? DELIVERY_CHARGE_STANDARD : 0) + DELIVERY_CHARGE_EXPRESS_EXTRA).toFixed(2) }</SelectItem>
                  <SelectItem value="pickup">In-Store Pickup (Today) - Free</SelectItem>
                </SelectContent>
              </Select>
            
            <Separator />
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
                    <DropdownMenuContent align="end">
                      {availablePromoCodes.length > 0 ? (
                        availablePromoCodes.map((promo) => (
                          <DropdownMenuItem
                            key={promo.id}
                            onClick={() => {
                              setPromoCodeInput(promo.code);
                              setPromoMessage(null); 
                            }}
                          >
                            {promo.code} - <span className="text-xs text-muted-foreground ml-1">{promo.description || `${promo.value}${promo.discountType === 'percentage' ? '%' : '₹'} off`}</span>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                            {promoFetchError ? 'Error loading codes' : 'No active promo codes'}
                        </DropdownMenuItem>
                      )}
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
                 {promoFetchError && (
                    <p className="text-xs text-destructive mt-1">{promoFetchError}</p>
                 )}
              </div>
        </div>

        <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                
                {appliedPromoCode && (
                <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromoCode.code}):</span>
                    <span>-₹{calculatedDiscount.toFixed(2)}</span>
                </div>
                )}
                {(deliveryCharge || 0) > 0 && <div className="flex justify-between text-muted-foreground"><span>Delivery Charge:</span><span>₹{deliveryCharge.toFixed(2)}</span></div>}
                {subtotal > 0 && (
                    <>
                        <div className="flex justify-between text-muted-foreground"><span>GST (18% on ₹{subtotal.toFixed(2)}):</span><span>₹{gstAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Handling Charge:</span><span>₹{HANDLING_CHARGE.toFixed(2)}</span></div>
                    </>
                )}
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-base"><span>Total Amount:</span><span>₹{totalAmount.toFixed(2)}</span></div>
            </CardContent>
            <CardFooter>
                <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleProceedToPayment} 
                    disabled={cartItems.length === 0 || totalAmount <=0 || !isAddressValid()}
                >
                Proceed to Payment
                </Button>
            </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
