
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem, Address } from '@/lib/types';
import { ChevronLeft, ShoppingBag, Edit3, Trash2, Clock, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

const DELIVERY_CHARGE_THRESHOLD = 299;
const DELIVERY_CHARGE_STANDARD = 50;
const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

const getEmojiForProduct = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('apple')) return '🍎';
    if (lowerName.includes('banana')) return '🍌';
    if (lowerName.includes('milk')) return '🥛';
    if (lowerName.includes('bread')) return '🍞';
    if (lowerName.includes('chips')) return '🥔';
    if (lowerName.includes('cola') || lowerName.includes('pepsi')) return '🥤';
    if (lowerName.includes('chicken')) return '🍗';
    if (lowerName.includes('eggs')) return '🥚';
    if (lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('juice')) return '🧃';
    return '🛒'; 
};

export default function VerifyItemsPage() {
  const { cartItems, getCartTotal, removeFromCart, getTotalItems } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
        toast({
            title: "Your cart is empty",
            description: "Redirecting you to the products page.",
            variant: "default"
        });
        router.push('/products');
    }
  }, [cartItems, router, toast]);

  useEffect(() => {
    const fetchDefaultAddress = async (userId: string) => {
      setAddressLoading(true);
      try {
        const addressesRef = collection(db, 'addresses');
        let q = query(addressesRef, where('userId', '==', userId), where('isDefault', '==', true), limit(1));
        let querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          q = query(addressesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(1));
          querySnapshot = await getDocs(q);
        }
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setDefaultAddress({ id: doc.id, ...doc.data() } as Address);
        } else {
          setDefaultAddress(null);
        }
      } catch (error) {
        console.error("Error fetching default address:", error);
        toast({ title: 'Error', description: 'Could not fetch your address.', variant: 'destructive' });
      } finally {
        setAddressLoading(false);
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        fetchDefaultAddress(user.uid);
      } else {
        setAddressLoading(false);
        setDefaultAddress(null);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const subtotal = getCartTotal();
  const totalItems = getTotalItems();
  const uniqueItemsCount = cartItems.length;

  const shippingMethod = 'standard'; // Assume standard shipping
  const deliveryCharge = useMemo(() => {
    if (subtotal <= 0) return 0;
    return subtotal < DELIVERY_CHARGE_THRESHOLD ? DELIVERY_CHARGE_STANDARD : 0;
  }, [subtotal]);
  
  const gstAmount = useMemo(() => subtotal > 0 ? subtotal * GST_RATE : 0, [subtotal]);
  
  const totalAmount = useMemo(() => {
    const preliminaryTotal = subtotal + gstAmount + deliveryCharge + (subtotal > 0 ? HANDLING_CHARGE : 0);
    return Math.max(0, preliminaryTotal);
  }, [subtotal, gstAmount, deliveryCharge]);

  const handleProceedToPayment = () => {
    if (!defaultAddress) {
        toast({ title: 'Address Missing', description: 'Please add a default address in your profile to proceed.', variant: 'destructive'});
        router.push('/profile/addresses');
        return;
    }

    const shippingInfo = {
        address: defaultAddress, 
        method: shippingMethod,
        promoCode: null, // Promo codes are handled elsewhere or removed.
        summary: { subtotal, discount: 0, deliveryCharge, gstAmount, handlingCharge: subtotal > 0 ? HANDLING_CHARGE : 0, totalAmount }
    };
    if (typeof window !== 'undefined') {
        localStorage.setItem('checkoutShippingInfo', JSON.stringify(shippingInfo));
    }
    router.push('/checkout/payment-details');
  };

  if (cartItems.length === 0 || authLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Full Cart View
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Review Your Items</h1>
      <p className="text-muted-foreground text-center mb-8">Please check your order before proceeding.</p>

      <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        <Card className="border-none shadow-none">
            <CardHeader className="px-1 pb-4">
                <CardTitle className="text-xl font-semibold">Step 1: Verify Your Items</CardTitle>
                <CardDescription>Review your cart contents, quantities, and prices.</CardDescription>
            </CardHeader>
            <CardContent className="px-1 space-y-4">
            {cartItems.map((item: CartItem) => {
                return (
                <div key={item.id} className="flex items-center p-3 gap-3 shadow-sm border rounded-lg bg-secondary/20">
                    <div className="text-2xl hidden sm:block">{getEmojiForProduct(item.name)}</div>
                    <div className="flex-grow">
                        <h3 className="font-medium text-sm sm:text-base"><span className="sm:hidden">{getEmojiForProduct(item.name)}</span> {item.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.quantity} &times; ₹{item.price.toFixed(2)} = <span className="font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/cart" aria-label={`Edit ${item.name} quantity`}>
                                <Edit3 className="h-4 w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                            <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Remove</span>
                        </Button>
                    </div>
                </div>
                );
            })}
            <Separator className="my-4"/>

            <div className="p-4 rounded-lg bg-secondary/30 border">
                 <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground flex items-center"><Package className="h-4 w-4 mr-2"/>Total Unique Items</span>
                    <span className="font-semibold">{uniqueItemsCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-muted-foreground flex items-center"><ShoppingBag className="h-4 w-4 mr-2"/>Total Quantity</span>
                    <span className="font-semibold">{totalItems}</span>
                </div>
                <Separator/>
                <div className="flex justify-between items-center font-bold text-lg mt-3">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-blue-600 shrink-0"/>
                <p>Estimated Delivery: <span className="font-semibold">Today by 8:00 PM</span></p>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleProceedToPayment} className="w-full sm:w-auto" size="lg" disabled={addressLoading}>
                    {addressLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Proceed to Payment
                </Button>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
