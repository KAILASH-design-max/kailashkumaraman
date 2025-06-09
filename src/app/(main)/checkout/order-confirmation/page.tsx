
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export default function OrderConfirmationPage() {
  const { cartItems } = useCart(); // To ensure cart is empty or handle appropriately
  const router = useRouter();

  useEffect(() => {
    // Optional: If a user lands here directly without a "placed order" flag (e.g. from localStorage)
    // and cart is not empty, it might be an erroneous navigation.
    // For simplicity now, we assume this page is only reached after order placement logic
    // which would have cleared the cart.
    // If you want stricter control, you could set a flag in localStorage when order is placed
    // and check for it here.
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-secondary">
      <Card className="w-full max-w-lg shadow-xl text-center p-6 sm:p-8 bg-background rounded-xl">
        <CardHeader className="pb-4">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center animate-pulse opacity-20"></div>
            <CheckCircle className="mx-auto h-24 w-24 text-primary stroke-[1.5]" />
             {/* Decorative dots - simplified */}
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary/50 rounded-full animate-ping delay-100"></span>
            <span className="absolute top-8 left-0 h-3 w-3 bg-primary/50 rounded-full animate-ping delay-200"></span>
            <span className="absolute bottom-2 right-1 h-2.5 w-2.5 bg-primary/50 rounded-full animate-ping delay-300"></span>
            <span className="absolute bottom-8 left-5 h-2 w-2 bg-primary/50 rounded-full animate-ping delay-400"></span>

          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary mt-4">Thank you for ordering!</CardTitle>
          <p className="text-muted-foreground text-base">
            Your order has been placed successfully. You'll receive an email confirmation shortly with your order details.
          </p>
          <p className="text-sm text-muted-foreground/80 italic">
            (Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor)
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Button variant="outline" asChild className="w-full sm:w-auto py-3 text-base border-primary text-primary hover:bg-primary/10">
              <Link href="/profile">View Order</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto py-3 text-base">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
