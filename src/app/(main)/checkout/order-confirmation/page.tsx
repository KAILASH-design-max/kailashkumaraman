
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // If a user lands here directly without an orderId, redirect them.
    if (!orderId) {
      router.replace('/');
    }

    // Clean up checkout data from localStorage now that the order is confirmed.
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finalOrderData');
      localStorage.removeItem('checkoutShippingInfo');
    }
  }, [orderId, router]);

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-secondary">
      <Card className="w-full max-w-lg shadow-xl text-center p-6 sm:p-8 bg-background rounded-xl">
        <CardHeader className="pb-4">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center animate-pulse opacity-20"></div>
            <CheckCircle className="mx-auto h-24 w-24 text-primary stroke-[1.5]" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary/50 rounded-full animate-ping delay-100"></span>
            <span className="absolute top-8 left-0 h-3 w-3 bg-primary/50 rounded-full animate-ping delay-200"></span>
            <span className="absolute bottom-2 right-1 h-2.5 w-2.5 bg-primary/50 rounded-full animate-ping delay-300"></span>
            <span className="absolute bottom-8 left-5 h-2 w-2 bg-primary/50 rounded-full animate-ping delay-400"></span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary mt-4">Thank you for ordering!</CardTitle>
          <p className="text-muted-foreground text-base">
            Your order has been placed successfully. You can now track its status or continue shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            {orderId ? (
              <Button asChild className="w-full sm:w-auto py-3 text-base">
                <Link href={`/profile/orders/${orderId}/track`}>
                  <Truck className="mr-2 h-5 w-5" />
                  Track Delivery Status
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full sm:w-auto py-3 text-base">
                <Link href="/profile/orders">View My Orders</Link>
              </Button>
            )}
            <Button variant="outline" asChild className="w-full sm:w-auto py-3 text-base">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
