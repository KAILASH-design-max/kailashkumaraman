
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RemovedShippingPage() {
  const router = useRouter();

  useEffect(() => {
    // This page is no longer used. Redirect to the main checkout page.
    router.replace('/checkout');
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to checkout...</p>
      </div>
    </div>
  );
}
