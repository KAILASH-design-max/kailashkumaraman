
'use client'; // For client-side interactions like searchParams and filtering

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/customer/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearchTerm = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm); // Search term state remains for URL query
  const [sortBy, setSortBy] = useState('relevance'); // options: relevance, price-asc, price-desc, rating

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    if (selectedCategory !== 'all') {
      const categoryId = mockCategories.find(c => c.slug === selectedCategory)?.id;
      if (categoryId) {
        products = products.filter(p => p.category === categoryId);
      }
    }

    if (searchTerm) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sorting
    if (sortBy === 'price-asc') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return products;
  }, [selectedCategory, searchTerm, sortBy]);
  
  const currentCategoryName = mockCategories.find(c => c.slug === selectedCategory)?.name || "All Products";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{currentCategoryName}</h1>
        <p className="text-muted-foreground">Browse our wide selection of products.</p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow sticky top-16 z-40 flex flex-col md:flex-row gap-4 items-center md:justify-start">
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map(category => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search via the header bar.
          </p>
          <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
