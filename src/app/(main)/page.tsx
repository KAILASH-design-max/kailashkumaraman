
'use client'; // Make homepage client to use ProductCard which is now client

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCategories, mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Star, Search, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/customer/ProductCard'; // Import the client ProductCard

// ProductCard is now imported from its own file, no need to define it here.

export default function HomePage() {
  const recommendedProducts = mockProducts.slice(0, 4);
  const popularCategories = mockCategories.slice(0, 5);

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 text-center rounded-lg bg-secondary p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Groceries in Minutes!</h1>
        <p className="text-lg text-secondary-foreground mb-8 max-w-2xl mx-auto">
          Your favorite products, delivered at lightning speed. What are you looking for today?
        </p>
        <div className="relative max-w-xl mx-auto">
          <Input 
            type="search" 
            placeholder="Search for milk, bread, snacks..." 
            className="w-full h-12 pl-12 pr-4 text-base rounded-full shadow-md"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} passHref>
              <Card className="group overflow-hidden text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={200}
                    height={150}
                    className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={category.dataAiHint || 'category image'}
                  />
                </CardContent>
                <CardFooter className="p-3 bg-card/80 backdrop-blur-sm">
                  <h3 className="text-md font-medium w-full group-hover:text-primary transition-colors">{category.name}</h3>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Recommended For You</h2>
          <Link href="/products" passHref>
            <Button variant="link" className="text-primary">View All &rarr;</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="mb-12 bg-primary text-primary-foreground p-8 rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Tired of making lists?</h2>
        <p className="text-lg mb-6">Let our AI craft your Smart Shopping List based on your needs!</p>
        <Link href="/profile/smart-list" passHref>
          <Button variant="secondary" size="lg">Try Smart List</Button>
        </Link>
      </section>

    </div>
  );
}

    