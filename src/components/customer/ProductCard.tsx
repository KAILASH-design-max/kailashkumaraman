
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
      <CardContent className="p-3 space-y-1.5 flex-grow"> {/* Adjusted padding and spacing */}
        <Link href={`/products/${product.slug}`} className="block">
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2 h-[2.8em]"> {/* Adjusted font size and height */}
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 h-[2.4em]">{product.description}</p> {/* Adjusted font size and height */}
        <div className="flex items-center justify-between pt-0.5"> {/* Adjusted padding top */}
          <p className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p> {/* Adjusted font size */}
          {product.rating && (
            <div className="flex items-center gap-0.5"> {/* Adjusted gap */}
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {/* Adjusted icon size */}
              <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewsCount || 0})</span> {/* Adjusted font size */}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0"> {/* Adjusted padding */}
        {product.stock && product.stock > 0 ? (
           <Button className="w-full" size="sm" onClick={handleAddToCart}> {/* Added size="sm" */}
             <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
           </Button>
        ) : (
          <Button className="w-full" size="sm" disabled variant="outline">Out of Stock</Button> /* Added size="sm" */
        )}
      </CardFooter>
    </Card>
  );
}
