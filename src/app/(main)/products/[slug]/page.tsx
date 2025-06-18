
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DeprecatedProductSlugPage({ params }: { params: { slug: string } }) {
  // This page is deprecated. Product details are now at /products/[productId]
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold">Page Deprecated or Not Found</h1>
      <p className="my-2 text-muted-foreground">
        You might be looking for a product page that has moved.
      </p>
      <p className="my-4">
        Product pages are now accessed by product ID, not by slug.
      </p>
      <Link href="/products" className="mt-4 inline-block">
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Products
        </Button>
      </Link>
    </div>
  );
}
