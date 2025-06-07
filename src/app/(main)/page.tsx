
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCategories, mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/customer/ProductCard'; 
import { ProductSuggester } from '@/components/customer/ProductSuggester';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, XCircle } from 'lucide-react';

export default function HomePage() {
  const recommendedProducts = mockProducts.slice(0, 6); 
  const allCategories = mockCategories; 

  // State for homepage search (currently removed from UI, logic remains)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const results = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 text-center rounded-lg bg-secondary p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Groceries in Minutes!</h1>
        <p className="text-lg text-secondary-foreground mb-8 max-w-2xl mx-auto">
          Your favorite products, delivered at lightning speed. What are you looking for today?
        </p>
      </section>

      {/* Product Suggester - AI based */}
      <ProductSuggester />

      {/* Category Display Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
          {allCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} passHref>
              <Card className="group overflow-hidden text-center transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                <CardContent className="p-0 relative aspect-square w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 48vw, (max-width: 768px) 23vw, (max-width: 1024px) 18vw, 9vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                    data-ai-hint={category.dataAiHint || 'category image'}
                  />
                </CardContent>
                <div className="py-2 px-1 text-center">
                  <p className="text-xs font-medium text-foreground truncate group-hover:text-primary">
                    {category.name}
                  </p>
                </div>
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
