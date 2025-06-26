
'use client';

import Image from 'next/image';
import type { Product, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft, MessageSquare, CheckCircle, XCircle, AlertTriangle, Send, Loader2, UserCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, type Timestamp } from 'firebase/firestore';
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
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

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
      let userHasReviewedThisProduct = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (currentUser && data.userId === currentUser.uid) {
          userHasReviewedThisProduct = true;
        }
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
      setHasUserReviewed(userHasReviewedThisProduct);
      setReviewsLoading(false);
    }, (error) => {
      console.error("Error fetching reviews: ", error);
      toast({ title: "Error", description: "Could not fetch reviews.", variant: "destructive" });
      setReviewsLoading(false);
    });

    return () => unsubscribe();
  }, [product.id, currentUser, toast]);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    if (newRating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
     if (hasUserReviewed) {
      setReviewError("You have already submitted a review for this product.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous User",
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      setNewRating(0);
      setNewComment('');
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("Failed to submit review. Please try again.");
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const mainImageSrc = product.images?.[0] || 'https://placehold.co/600x450.png';
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
              src={mainImageSrc}
              alt={product.name}
              width={600}
              height={450}
              className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[4/3]"
              data-ai-hint={mainImageDataAiHint}
              priority 
            />
          </div>
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
        <div className="grid md:grid-cols-2 gap-8">
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
                    <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to write one!</p>
                )}
            </div>

            <div>
                 <Card className="sticky top-24 shadow-lg">
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!currentUser ? (
                             <p className="text-center text-muted-foreground">Please <Link href="/login" className="text-primary font-medium hover:underline">sign in</Link> to write a review.</p>
                        ) : hasUserReviewed ? (
                            <p className="text-center text-green-600">Thank you for your review!</p>
                        ) : (
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <Label className="font-medium mb-2 block">Your Rating</Label>
                                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-7 w-7 cursor-pointer transition-colors ${ (hoverRating || newRating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground' }`}
                                                onClick={() => setNewRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="comment" className="font-medium">Your Comment (Optional)</Label>
                                    <Textarea id="comment" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Tell us what you thought..."/>
                                </div>
                                {reviewError && <p className="text-sm text-destructive">{reviewError}</p>}
                                <Button type="submit" disabled={isSubmittingReview} className="w-full">
                                    {isSubmittingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                                    Submit Review
                                </Button>
                            </form>
                        )}
                    </CardContent>
                 </Card>
            </div>
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
