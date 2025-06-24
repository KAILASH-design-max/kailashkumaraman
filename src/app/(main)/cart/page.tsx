
'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MinusCircle, PlusCircle, Trash2, ShoppingBag, ChefHat, Loader2, Sparkles, Tag, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { generateCartRecipe, type GenerateCartRecipeOutput } from '@/ai/flows/generate-cart-recipe-flow';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState<GenerateCartRecipeOutput | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // Static order summary values for display
  const subtotalStatic = 250.00;
  const gstRate = 0.18;
  const handlingCharge = 5.00;
  const deliveryFee = 30.00;
  const promoCode = 'SAVE31';
  const discountAmount = 10.00;

  const gstAmountStatic = subtotalStatic * gstRate;
  const totalAmountStatic = subtotalStatic + gstAmountStatic + handlingCharge + deliveryFee - discountAmount;


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
    if (auth.currentUser) {
      router.push('/checkout');
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout.",
        variant: "default",
      });
      router.push('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0 && !isRecipeLoading && !recipe && !recipeError) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const imageUrl = item.images?.[0] || 'https://placehold.co/112x112.png';
            const imageHint = item.dataAiHint || 'product item';
            return (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                    data-ai-hint={imageHint}
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <Link href={`/products/${item.id}`} passHref>
                    <h2 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity) && newQuantity >= 1) {
                        updateQuantity(item.id, newQuantity);
                      } else if (e.target.value === '') {
                         // Allow clearing, will default to 1 or handle by updateQuantity
                      }
                    }}
                    onBlur={(e) => { // Handle empty input on blur
                      if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                          updateQuantity(item.id, 1);
                      }
                    }}
                    className="w-16 h-10 text-center hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                <p className="font-semibold text-lg sm:w-24 text-center sm:text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive hover:text-destructive/80"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            );
          })}
          {cartItems.length > 0 && (
            <div className="flex justify-end mt-6">
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

        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotalStatic.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gstAmountStatic.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span>₹{handlingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600 font-medium">
                  <span className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Promo Applied ({promoCode})
                  </span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total Payable</span>
                <span>₹{totalAmountStatic.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="flex items-center justify-center text-green-700 font-semibold text-sm bg-green-50/50 p-3 rounded-md w-full">
                    <CheckCircle className="mr-2 h-6 w-6" />
                    You Saved ₹{discountAmount.toFixed(2)} on this order!
                </div>
               {cartItems.length > 0 ? (
                <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                </Button>
               ) : (
                 <Button className="w-full" size="lg" disabled>
                    Proceed to Checkout
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
