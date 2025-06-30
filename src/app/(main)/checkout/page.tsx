
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CheckoutRedirectPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  useEffect(() => {
    // If cart is empty, go back to cart page which will then redirect to products.
    // Otherwise, proceed to payment details.
    if (cartItems.length === 0) {
        router.replace('/cart');
    } else {
        router.replace('/checkout/payment-details');
    }
  }, [router, cartItems]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Proceeding to payment...</p>
      </div>
    </div>
  );
}
