
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/lib/types';
import { ChevronLeft, ShoppingBag, Edit3, Trash2, Clock, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Helper to get an emoji based on product name - simplified for demo
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
    return '🛒'; // Default
};


export default function VerifyItemsPage() {
  const { cartItems, getCartTotal, removeFromCart, getTotalItems } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = getCartTotal();
  const totalItems = getTotalItems();
  const uniqueItemsCount = cartItems.length;

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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Redirecting you...</p>
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
                <CardDescription>Please review your cart contents, quantities, and prices.</CardDescription>
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
                <Button onClick={() => router.push('/checkout/shipping-details')} className="w-full sm:w-auto" size="lg">
                    Proceed to Shipping Details
                </Button>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

