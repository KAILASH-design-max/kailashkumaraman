
'use client';

import Image from 'next/image';
import type { Product, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft, MessageSquare, CheckCircle, XCircle, AlertTriangle, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/customer/ProductCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, type Timestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
    categoryName?: string;
}

export function ProductDetailClient({ product, relatedProducts, categoryName }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || 'https://placehold.co/600x450.png');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!product.id) return;
    setReviewsLoading(true);

    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', product.id), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          productId: data.productId,
          userId: data.userId,
          userName: data.userName,
          rating: data.rating,
          comment: data.comment,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
        });
      });
      setReviews(fetchedReviews);
      setReviewsLoading(false);
    }, (error) => {
      console.error("Error fetching reviews: ", error);
      toast({ title: "Error", description: "Could not fetch reviews.", variant: "destructive" });
      setReviewsLoading(false);
    });

    return () => unsubscribe();
  }, [product.id, toast]);
  
  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(product.images?.[0] || 'https://placehold.co/600x450.png');
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const mainImageDataAiHint = product.dataAiHint || 'product details main';
  const isAvailable = product.status === 'active' && product.stock > 0;
  const isLowStock = isAvailable && product.lowStockThreshold != null && product.stock < product.lowStockThreshold;

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
          <div className="mb-4">
            <Image
              src={selectedImage}
              alt={product.name}
              width={600}
              height={450}
              className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[4/3]"
              data-ai-hint={mainImageDataAiHint}
              priority 
            />
          </div>
           {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary shadow-md' : 'border-transparent hover:border-muted'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-cover"
                    data-ai-hint={product.dataAiHint || `product thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          {categoryName && <Badge variant="outline">{categoryName}</Badge>}

          <div className="flex items-center space-x-4">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-md font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviews.length || product.reviewsCount || 0} reviews)</span>
              </div>
            )}
             {(reviews.length > 0) && <Separator orientation="vertical" className="h-5"/>}
            {(reviews.length > 0) && (
              <a href="#reviews" className="text-sm text-primary hover:underline flex items-center">
                <MessageSquare className="mr-1 h-4 w-4"/> See Reviews
              </a>
            )}
          </div>

          <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>

          <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
          
          {isAvailable ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>In Stock ({product.stock} available)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span>Out of Stock</span>
            </div>
          )}

          {isLowStock && (
             <div className="flex items-center space-x-2 text-yellow-600 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Low Stock!</span>
              <span>Only {product.stock} left.</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAvailable ? (
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
                    <li>Weight/Volume: {product.weight || 'N/A'}</li>
                    <li>Origin: {product.origin || 'N/A'}</li>
                    <li>Status: {product.status} (Stock: {product.stock})</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section id="reviews" className="mt-16 pt-8 border-t">
        <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
            {reviewsLoading ? (
                <p className="text-muted-foreground">Loading reviews...</p>
            ) : reviews.length > 0 ? (
            reviews.map((review) => (
                <Card key={review.id} className="bg-secondary/30">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <UserCircle className="h-8 w-8 text-muted-foreground" />
                                <CardTitle className="text-base font-semibold">{review.userName}</CardTitle>
                            </div>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, s_idx) => (
                                    <Star key={s_idx} className={`h-4 w-4 ${s_idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}/>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm italic">"{review.comment || 'No comment provided.'}"</p>
                    </CardContent>
                </Card>
            ))
            ) : (
                <p className="text-muted-foreground text-center py-4">No reviews yet for this product.</p>
            )}
        </div>
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
