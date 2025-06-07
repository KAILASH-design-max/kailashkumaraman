'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col h-full group">
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="block">
        <CardHeader className="p-0 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.dataAiHint || 'product image'}
          />
           {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold px-3 py-1 bg-destructive rounded">OUT OF STOCK</span>
            </div>
          )}
        </CardHeader>
      </Link>
      <CardContent className="p-4 space-y-2 flex-grow">
        <Link href={`/products/${product.slug}`} className="block">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 h-[3em]">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 h-[2.5em]">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewsCount || 0})</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {product.stock && product.stock > 0 ? (
           <Button className="w-full" onClick={handleAddToCart}>
             <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
           </Button>
        ) : (
          <Button className="w-full" disabled variant="outline">Out of Stock</Button>
        )}
      </CardFooter>
    </Card>
  );
}
