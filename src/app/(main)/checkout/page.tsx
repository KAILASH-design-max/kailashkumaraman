
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/lib/types';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyItemsPage() {
  const { cartItems, getCartTotal } = useCart();
  const router = useRouter();

  const subtotal = getCartTotal();

  useEffect(() => {
    if (cartItems.length === 0) {
        router.push('/cart');
    }
  }, [cartItems, router]);

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
        <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Cart
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
                const imageUrl = item.images?.[0] || 'https://placehold.co/60x60.png';
                const imageHint = item.dataAiHint || 'checkout item';
                return (
                <Card key={item.id} className="flex items-center p-3 gap-3 shadow-sm border">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <Image src={imageUrl} alt={item.name} fill sizes="64px" className="object-cover" data-ai-hint={imageHint} />
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
