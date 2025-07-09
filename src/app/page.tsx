
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCategories } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/customer/ProductCard'; 
import { ProductSuggester } from '@/components/customer/ProductSuggester';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

// Helper to safely serialize product data from Firestore
function serializeProduct(doc: any): Product {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        images: data.images || [],
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        stock: data.stock || 0,
        status: data.status || 'inactive',
        lowStockThreshold: data.lowStockThreshold,
        weight: data.weight,
        origin: data.origin,
        popularity: data.popularity,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : String(data.createdAt || ''),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : String(data.updatedAt || ''),
        dataAiHint: data.dataAiHint,
    };
}

async function fetchRecommendedProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    // Fetch active products, sorted by popularity
    const q = query(
      productsCollection,
      where('status', '==', 'active'),
      orderBy('popularity', 'desc'),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push(serializeProduct(doc));
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    // On error (e.g., missing index), return empty array to prevent page crash.
    // Check console for index creation link from Firestore.
    return [];
  }
}


export default async function RootPage() {
  const recommendedProducts = await fetchRecommendedProducts();
  const allCategories = mockCategories; 

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section - Banner Image */}
      <section className="mb-12 flex justify-center">
        <div className="relative w-full aspect-[2/1] md:aspect-[16/4] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-102">
          <Image
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-4eb0-6230-a7e6-bd48b2d996c2/raw?se=2025-06-10T14%3A06%3A21Z&sp=r&sv=2024-08-04&sr=b&scid=33b84762-f949-570f-b4fa-6ef131dbef21&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T22%3A02%3A05Z&ske=2025-06-10T22%3A02%3A05Z&sks=b&skv=2024-08-04&sig=XF/ImMMypL6ZDE5CdRqZpkb7Or1VgZIG4HPaVQN5XZA%3D"
            alt="Promotional banner for SpeedyShop"
            fill
            sizes="100vw"
            className="object-cover"
            data-ai-hint="hero banner"
            priority
          />
        </div>
      </section>


      {/* Existing Second Banner Image Section */}
      <section className="mb-12 flex justify-center">
        <div className="relative w-full aspect-[2/1] md:aspect-[16/4] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-102">
          <Image
            src="https://sdmntprwestus.oaiusercontent.com/files/00000000-5250-6230-af1d-94f9012057ed/raw?se=2025-06-10T13%3A58%3A10Z&sp=r&sv=2024-08-04&sr=b&scid=73492e29-0436-5d7d-86fe-d20e71978f65&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-09T22%3A01%3A57Z&ske=2025-06-10T22%3A01%3A57Z&sks=b&skv=2024-08-04&sig=csQKfYWjNqRGiy%2Bp1XCWcL/uWY6up4OKFGI%2BwiwmLDU%3D"
            alt="New promotional banner"
            fill
            sizes="100vw"
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
          {allCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`} passHref className="group block text-center">
              <Card className="overflow-hidden h-full flex flex-col justify-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0 flex-grow flex items-center justify-center">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={category.dataAiHint || 'category image'}
                    />
                  </div>
                </CardContent>
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
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground">Could not load recommended products. Please try again later.</p>
          )}
        </div>
      </section>
      
    </div>
  );
}
