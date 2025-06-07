
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCategories, mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Star, ShoppingCart, Search as SearchIcon } from 'lucide-react'; 
import { ProductCard } from '@/components/customer/ProductCard'; 
import { ProductSuggester } from '@/components/customer/ProductSuggester';
import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const recommendedProducts = mockProducts.slice(0, 6); 
  const popularCategories = mockCategories.slice(0, 9); 

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchPerformed(false); // Or true with empty results if you want to show "No products" for empty search
      return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setSearchResults(results);
    setSearchPerformed(true);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 text-center rounded-lg bg-secondary p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Groceries in Minutes!</h1>
        <p className="text-lg text-secondary-foreground mb-8 max-w-2xl mx-auto">
          Your favorite products, delivered at lightning speed. What are you looking for today?
        </p>
      </section>

      {/* Product Search Section */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-card-foreground">Search Products</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="search"
              placeholder="Enter product name..."
              className="flex-grow h-11 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
            <Button onClick={handleSearch} className="h-11 text-base" aria-label="Submit search">
              <SearchIcon className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </div>

        {searchPerformed && (
          <div className="mt-10">
            {searchResults.length > 0 ? (
              <>
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  Search Results for "{searchTerm}"
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground mt-6 text-lg">
                No products found for "{searchTerm}".
              </p>
            )}
          </div>
        )}
      </section>

      <ProductSuggester />

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
    </div>
  );
}
