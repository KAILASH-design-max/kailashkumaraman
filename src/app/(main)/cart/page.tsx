
'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ChefHat, Loader2, Sparkles, Tag, CheckCircle, Percent, ChevronRight, Home } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { generateCartRecipe, type GenerateCartRecipeOutput } from '@/ai/flows/generate-cart-recipe-flow';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Address, PromoCode } from '@/lib/types';
import { collection, query, where, getDocs, limit, orderBy, Timestamp } from 'firebase/firestore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [recipe, setRecipe] = useState<GenerateCartRecipeOutput | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  // Dynamic order summary values
  const subtotal = getCartTotal();
  const gstRate = 0.18;
  const handlingCharge = 5.00;
  const deliveryFee = 30.00;

  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0;
    if (subtotal < (appliedPromo.minOrderValue || 0)) return 0;

    if (appliedPromo.discountType === 'fixed') {
        return appliedPromo.value;
    }
    if (appliedPromo.discountType === 'percentage') {
        return (subtotal * appliedPromo.value) / 100;
    }
    return 0;
  }, [appliedPromo, subtotal]);
  
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal > 0 ? (subtotal + gstAmount + handlingCharge + deliveryFee - discountAmount) : 0;
  
  useEffect(() => {
    const fetchDefaultAddress = async (userId: string) => {
      setAddressLoading(true);
      try {
        const addressesRef = collection(db, 'addresses');
        // First, try to find an address marked as default
        let q = query(addressesRef, where('userId', '==', userId), where('isDefault', '==', true), limit(1));
        let querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // If no default, just get the most recently created one
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
      } finally {
        setAddressLoading(false);
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
  }, []);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) {
        setPromoError("Please enter a promo code.");
        return;
    }
    setIsPromoLoading(true);
    setPromoError(null);
    setAppliedPromo(null);

    try {
        const promoRef = collection(db, "promoCodes");
        const q = query(promoRef, where("code", "==", promoCodeInput.trim().toUpperCase()), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setPromoError("Invalid promo code. Please try again.");
            setIsPromoLoading(false);
            return;
        }

        const promoDoc = querySnapshot.docs[0];
        const promoData = { id: promoDoc.id, ...promoDoc.data() } as PromoCode;

        if (promoData.status !== 'active') {
            setPromoError("This promo code is not active.");
        } else if (new Date(promoData.expiresAt) < new Date()) {
            setPromoError("This promo code has expired.");
        } else if (promoData.minOrderValue && subtotal < promoData.minOrderValue) {
            setPromoError(`This code is valid for orders over ₹${promoData.minOrderValue}.`);
        } else {
            setAppliedPromo(promoData);
            setPromoCodeInput('');
            toast({
                title: "Promo Code Applied!",
                description: promoData.description,
            });
        }

    } catch (error) {
        console.error("Error applying promo code:", error);
        setPromoError("An error occurred while applying the code.");
    } finally {
        setIsPromoLoading(false);
    }
  };

  const handleGenerateRecipe = async () => {
    if (cartItems.length === 0) {
      setRecipeError("Please add items to your cart before generating a recipe.");
      return;
    }
    setIsRecipeLoading(true);
    setRecipeError(null);
    setRecipe(null);
    try {
      const itemNames = cartItems.map(item => item.name);
      const result = await generateCartRecipe({ cartItems: itemNames });
      setRecipe(result);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipeError("Sorry, we couldn't generate a recipe at this time. Please try again later.");
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (authLoading || addressLoading) return;
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout.",
        variant: "default",
      });
      router.push('/login?redirect=/checkout');
      return;
    }
    
    if (defaultAddress) {
      router.push('/checkout');
    } else {
       toast({
         title: "Address Required",
         description: "Please select a delivery address to continue.",
         variant: "destructive",
       });
    }
  };

  if (cartItems.length === 0 && !isRecipeLoading && !recipe && !recipeError) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const isCheckoutActionDisabled = authLoading || addressLoading || !defaultAddress;
  const checkoutButtonLabel = defaultAddress ? "Select Delivery Option" : "Proceed to Checkout";
  const checkoutTooltipMessage = addressLoading 
    ? "Fetching your address..." 
    : "Please select a delivery address to continue.";


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const imageUrl = item.images?.[0] || 'https://placehold.co/112x112.png';
            const imageHint = item.dataAiHint || 'product item';
            return (
              <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shrink-0 border">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 25vw, 15vw"
                          className="object-cover"
                          data-ai-hint={imageHint}
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                           <Link href={`/products/${item.id}`} passHref>
                            <h2 className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-2">{item.name}</h2>
                          </Link>
                          <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <p className="font-semibold text-base sm:text-lg text-primary mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                       <div className="flex flex-col items-end justify-between">
                         <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 h-8 w-8"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                           <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10);
                              if (!isNaN(newQuantity) && newQuantity >= 1) {
                                updateQuantity(item.id, newQuantity);
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                                  updateQuantity(item.id, 1);
                              }
                            }}
                            className="w-10 sm:w-12 h-8 text-center hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
              </Card>
            );
          })}
          {cartItems.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
            </div>
          )}

          <Card className="shadow-lg mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center">
                <Sparkles className="mr-2 h-6 w-6 text-primary" /> Get a Recipe for Your Cart! <Sparkles className="ml-2 h-6 w-6 text-primary" />
              </CardTitle>
              <CardDescription>
                Generate a recipe using the items currently in your cart!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRecipeLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p className="text-muted-foreground">Generating your delicious recipe...</p>
                </div>
              )}
              {recipeError && !isRecipeLoading && (
                <Alert variant="destructive">
                  <ChefHat className="h-4 w-4" />
                  <AlertTitle>Oops!</AlertTitle>
                  <AlertDescription>{recipeError}</AlertDescription>
                </Alert>
              )}
              {recipe && !isRecipeLoading && (
                <div className="space-y-4">
                  {!recipe.isPossible && recipe.notes && (
                     <Alert variant="default">
                        <ChefHat className="h-4 w-4" />
                        <AlertTitle>{recipe.recipeName || "Recipe Suggestion"}</AlertTitle>
                        <AlertDescription>{recipe.notes}</AlertDescription>
                    </Alert>
                  )}
                  {recipe.isPossible && (
                    <>
                      <h3 className="text-xl font-semibold text-primary">{recipe.recipeName}</h3>
                      <div>
                        <h4 className="font-medium text-md mb-1">Ingredients:</h4>
                        <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-0.5">
                          {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-md mb-1">Instructions:</h4>
                        <p className="text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
                      </div>
                      {recipe.notes && (
                        <div>
                          <h4 className="font-medium text-md mb-1">Notes:</h4>
                          <p className="text-sm text-muted-foreground italic">{recipe.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleGenerateRecipe}
                disabled={isRecipeLoading || cartItems.length === 0}
              >
                {isRecipeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChefHat className="mr-2 h-4 w-4" />}
                Generate Recipe ✨
              </Button>
            </CardFooter>
          </Card>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="promo-code">
              <AccordionTrigger className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Percent className="h-6 w-6 text-primary" />
                  <span className="font-medium">Avail Offers / Coupons</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-card rounded-b-lg">
                <div className="p-4 space-y-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Promo Code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      disabled={isPromoLoading}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromoCode(); }}
                    />
                    <Button onClick={handleApplyPromoCode} disabled={isPromoLoading}>
                      {isPromoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                  {promoError && <p className="text-sm text-destructive">{promoError}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="shadow-sm">
              <CardContent className="p-4 flex items-start gap-4">
                  <Checkbox id="contactless-delivery" className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                      <Label
                          htmlFor="contactless-delivery"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                          Leave the order at door or gate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                          Opt for no-contact delivery & our delivery partner will leave it at your door/gate.
                      </p>
                  </div>
              </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
          {currentUser && (
            <Card className="shadow-lg">
              <Link href="/checkout/shipping-details">
                <CardContent className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50">
                    <div className="flex items-start gap-4">
                        <Home className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <div className="grid gap-0.5 leading-none">
                            <p className="text-sm font-medium text-muted-foreground">
                              Deliver to
                            </p>
                            {addressLoading ? (
                              <p className="font-semibold">Loading address...</p>
                            ) : defaultAddress ? (
                              <>
                                <p className="font-semibold">{defaultAddress.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {defaultAddress.street}, {defaultAddress.city}
                                </p>
                              </>
                            ) : (
                              <p className="font-semibold text-primary">Select an Address</p>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Link>
            </Card>
          )}

          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span>₹{handlingCharge.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && appliedPromo && (
                  <div className="flex justify-between items-center text-green-600 font-medium">
                    <span className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Promo Applied ({appliedPromo.code})
                    </span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total Payable</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                {discountAmount > 0 && (
                  <div className="flex items-center justify-center text-green-700 font-semibold text-sm bg-green-50/50 p-3 rounded-md w-full">
                      <CheckCircle className="mr-2 h-6 w-6" />
                      You Saved ₹{discountAmount.toFixed(2)} on this order!
                  </div>
                )}
               {cartItems.length > 0 ? (
                isCheckoutActionDisabled ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full" tabIndex={0}>
                          <Button className="w-full" size="lg" disabled>
                            {(authLoading || addressLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {checkoutButtonLabel}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{checkoutTooltipMessage}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                    {checkoutButtonLabel}
                  </Button>
                )
               ) : (
                 <Button className="w-full" size="lg" disabled>
                    Add Items to Checkout
                 </Button>
               )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
