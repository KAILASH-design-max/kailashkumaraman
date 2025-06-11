
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
      {/* Hero Section - Banner Image */}
      <section className="banner-container my-10 mx-auto">
        <div className="relative w-full aspect-[16/5] max-w-[1200px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-102">
          <Image
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-4eb0-6230-a7e6-bd48b2d996c2/raw?se=2025-06-10T14%3A06%3A21Z&sp=r&sv=2024-08-04&sr=b&scid=33b84762-f949-570f-b4fa-6ef131dbef21&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T22%3A02%3A05Z&ske=2025-06-10T22%3A02%3A05Z&sks=b&skv=2024-08-04&sig=XF/ImMMypL6ZDE5CdRqZpkb7Or1VgZIG4HPaVQN5XZA%3D"
            alt="Promotional banner for SpeedyShop"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            data-ai-hint="hero banner"
            priority
          />
        </div>
      </section>


      {/* Existing Second Banner Image Section */}
      <section className="banner-container my-10 mx-auto">
        <div className="relative w-full aspect-[16/5] max-w-[1200px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-102">
          <Image
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-5250-6230-af1d-94f9012057ed/raw?se=2025-06-10T13%3A58%3A10Z&sp=r&sv=2024-08-04&sr=b&scid=73492e29-0436-5d7d-86fe-d20e71978f65&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T22%3A01%3A57Z&ske=2025-06-10T22%3A01%3A57Z&sks=b&skv=2024-08-04&sig=csQKfYWjNqRGiy%2Bp1XCWcL/uWY6up4OKFGI%2BwiwmLDU%3D"
            alt="New promotional banner"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            data-ai-hint="promo banner"
          />
        </div>
      </section>

      {/* Product Suggester - AI based */}
      <ProductSuggester />

      {/* Category Display Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-left">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} passHref>
              <Card className="group overflow-hidden text-center transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full bg-transparent border-transparent border-0 shadow-none">
                <CardContent className="p-0 relative aspect-square w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 639px) 48vw, (max-width: 767px) 30vw, (max-width: 1023px) 22vw, (max-width: 1279px) 15vw, 12vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                    data-ai-hint={category.dataAiHint || 'category image'}
                  />
                </CardContent>
                {/* Removed category name display div from here */}
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

