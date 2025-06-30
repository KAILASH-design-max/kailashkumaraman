
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
import { Package, MapPin, Edit3, PlusCircle, Trash2, ChevronLeft, AlertCircle, ShoppingBag, Phone, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Address } from '@/lib/types';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, onSnapshot } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const DELIVERY_CHARGE_THRESHOLD = 299;
const DELIVERY_CHARGE_STANDARD = 50;
const DELIVERY_CHARGE_EXPRESS_EXTRA = 50; 
const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

export default function ShippingDetailsPage() {
  const { cartItems, getCartTotal } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [shippingOption, setShippingOption] = useState('saved');
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', postalCode: '', country: 'India', phoneNumber: '' });
  const [shippingMethod, setShippingMethod] = useState('standard'); 

  // Firestore-related state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !currentUser) { // Allow navigation if user is just loading
        router.push('/cart');
    }
    
    // Fetch addresses from Firestore
    if (currentUser) {
      setAddressesLoading(true);
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedAddresses: Address[] = [];
          let defaultAddressId = '';
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              const address: Address = {
                  id: doc.id,
                  userId: data.userId,
                  name: data.name || '',
                  street: data.street || '',
                  city: data.city || '',
                  postalCode: data.postalCode || '',
                  country: data.country || '',
                  phoneNumber: data.phoneNumber || '',
                  isDefault: data.isDefault || false,
                  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : undefined,
              };
              fetchedAddresses.push(address);
              if (address.isDefault) {
                  defaultAddressId = doc.id;
              }
          });
          setSavedAddresses(fetchedAddresses);
          
          if (defaultAddressId) {
              setSelectedAddressId(defaultAddressId);
          } else if (fetchedAddresses.length > 0) {
              setSelectedAddressId(fetchedAddresses[0].id);
          } else {
              setSelectedAddressId('');
              setShippingOption('new');
          }
          setAddressesLoading(false);
      }, (error) => {
          console.error("Error fetching addresses:", error);
          toast({ type: 'error', text: 'Could not fetch saved addresses.' });
          setAddressesLoading(false);
      });
      return () => unsubscribe();
    } else {
      setAddressesLoading(false);
      setSavedAddresses([]);
    }

  }, [cartItems.length, router, currentUser, toast]);

  const subtotal = getCartTotal();

  const deliveryCharge = useMemo(() => {
    if (shippingMethod === 'pickup' || subtotal <= 0) return 0;
    let baseDeliveryCharge = (subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0) ? DELIVERY_CHARGE_STANDARD : 0;
    if (shippingMethod === 'express') {
      return baseDeliveryCharge + DELIVERY_CHARGE_EXPRESS_EXTRA;
    }
    return baseDeliveryCharge;
  }, [subtotal, shippingMethod]);
  
  const gstAmount = useMemo(() => subtotal > 0 ? subtotal * GST_RATE : 0, [subtotal]);
  
  const totalAmount = useMemo(() => {
    const preliminaryTotal = subtotal + gstAmount + deliveryCharge + (subtotal > 0 ? HANDLING_CHARGE : 0);
    return Math.max(0, preliminaryTotal);
  }, [subtotal, gstAmount, deliveryCharge]);

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
        toast({ title: 'Error', description: 'Please select or enter a valid shipping address.', variant: 'destructive'});
        return;
    }
    const currentAddress = shippingOption === 'saved' 
      ? savedAddresses.find(a => a.id === selectedAddressId) 
      : newAddress;

    if (!currentAddress) {
        toast({ title: 'Error', description: 'Selected address not found.', variant: 'destructive'});
        return;
    }

    const shippingInfo = {
        address: currentAddress, 
        method: shippingMethod,
        promoCode: null,
        summary: { subtotal, discount: 0, deliveryCharge, gstAmount, handlingCharge: subtotal > 0 ? HANDLING_CHARGE : 0, totalAmount }
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
        <p className="text-muted-foreground mb-8">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/checkout" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Item Review
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Shipping Details</h1>
      <p className="text-muted-foreground text-center mb-8">Provide your shipping address and choose a delivery method.</p>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
            <h3 className="text-xl font-semibold flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary" /> Step 2: Choose Delivery Address</h3>
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                <div>
                  <RadioGroupItem value="saved" id="savedAddr" disabled={savedAddresses.length === 0 && !addressesLoading} />
                  <Label htmlFor="savedAddr" className="ml-2 cursor-pointer">Use a saved address</Label>
                </div>
                {shippingOption === 'saved' && (
                  addressesLoading ? (
                      <div className="flex items-center space-x-2 text-muted-foreground p-2">
                          <Loader2 className="h-4 w-4 animate-spin"/>
                          <span>Loading your addresses...</span>
                      </div>
                  ) : (
                      <Select value={selectedAddressId} onValueChange={setSelectedAddressId} disabled={savedAddresses.length === 0}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={savedAddresses.length > 0 ? "Select a saved address" : "No saved addresses found"} />
                          </SelectTrigger>
                          <SelectContent>
                              {savedAddresses.map(addr => (
                                  <SelectItem key={addr.id} value={addr.id}>
                                      {addr.name} {addr.isDefault && '(Default)'} - {addr.street}, {addr.city}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  )
                )}
                {savedAddresses.length === 0 && !addressesLoading && shippingOption === 'saved' && (
                    <p className="text-sm text-muted-foreground mt-2 px-1">No saved addresses. Please add a new address below.</p>
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
        </div>

        <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                
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

    