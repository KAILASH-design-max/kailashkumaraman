
'use client';

import Image from 'next/image';
import { mockProducts, mockCategories } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft, MessageSquare, CheckCircle, XCircle } from 'lucide-react'; // Added XCircle
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/customer/ProductCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from '@/hooks/useCart';
import { useEffect, useState, use } from 'react'; // Imported 'use'

// Helper to simulate fetching a product by slug (can be adapted for actual API calls)
async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // In a real app, this would fetch from an API.
  // For now, it uses mock data.
  return mockProducts.find(p => p.slug === slug);
}

export default function ProductDetailPage({ params: paramsFromProps }: { params: { slug: string } }) {
  // Per Next.js warning, params object should be unwrapped using React.use
  // We cast paramsFromProps to `any` because its declared type is a plain object,
  // but the warning suggests it should be treated as a promise for `use`.
  const resolvedParams = use(paramsFromProps as any);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const fetchedProduct = await getProductBySlug(slug);
      setProduct(fetchedProduct || null);
      setLoading(false);
    }
    loadProduct();
  }, [slug]); // Depend on the resolved slug

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block">
          <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" />Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryName = mockCategories.find(c => c.id === product.category)?.name;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-primary flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Products {categoryName && `/ ${categoryName}`}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={450}
            className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[4/3]"
            data-ai-hint={product.dataAiHint || 'product details'}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          {categoryName && <Badge variant="outline">{categoryName}</Badge>}
          
          <div className="flex items-center space-x-4">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-md font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} reviews)</span>
              </div>
            )}
             {product.reviewsCount && product.reviewsCount > 0 && <Separator orientation="vertical" className="h-5"/>}
            {product.reviewsCount && product.reviewsCount > 0 && (
              <a href="#reviews" className="text-sm text-primary hover:underline flex items-center">
                <MessageSquare className="mr-1 h-4 w-4"/> See Reviews
              </a>
            )}
          </div>

          <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
          
          <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>

          {product.stock && product.stock > 0 ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>In Stock ({product.stock} available)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-destructive">
              <XCircle className="h-5 w-5" /> {/* Changed icon here */}
              <span>Out of Stock</span>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {product.stock && product.stock > 0 ? (
              <Button size="lg" className="w-full md:w-auto flex-grow" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            ) : (
               <Button size="lg" className="w-full md:w-auto flex-grow" disabled>
                <ShoppingCart className="mr-2 h-5 w-5" /> Out of Stock
               </Button>
            )}
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Category: {categoryName || 'N/A'}</li>
                    <li>Weight/Volume: Approx. 500g / 1L (example)</li>
                    <li>Origin: Local Farms (example)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Delivery Information</AccordionTrigger>
              <AccordionContent>
                SpeedyShop Proto offers delivery in as fast as 10 minutes in select areas. Standard delivery times are 15-30 minutes. Check availability at checkout.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section id="reviews" className="mt-16 pt-8 border-t">
        <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>
        {product.reviewsCount && product.reviewsCount > 0 ? (
           <div className="space-y-6">
            {[...Array(Math.min(3, product.reviewsCount || 0))].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">User {i+1}</CardTitle>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, s_idx) => (
                                    <Star key={s_idx} className={`h-4 w-4 ${s_idx < (product.rating || 5) - i % 2 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}/>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Reviewed on {new Date(Date.now() - i * 24 * 3600 * 1000).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">This is a great product! Highly recommended. Quality is good and delivery was fast.</p>
                    </CardContent>
                </Card>
            ))}
            { (product.reviewsCount || 0) > 3 && <Button variant="link">Show all reviews</Button>}
        </div>
        ) : (
             <p className="text-muted-foreground">No reviews yet for this product. Be the first to write one!</p>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-3xl font-semibold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
