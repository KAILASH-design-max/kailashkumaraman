
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Heart, Edit3, Trash2, PlusCircle, Share2, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product, Wishlist } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  getDoc, 
  Timestamp, 
  orderBy, 
  arrayRemove 
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


async function getProductDetails(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        id: productSnap.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        images: data.images || [],
        stock: data.stock || 0,
        status: data.status || 'inactive',
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

export default function WishlistsPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
        setWishlists([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const q = query(collection(db, 'MyWishlist'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedWishlists: Wishlist[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                name: data.name,
                items: (data.items || []).map((item: any) => ({
                    ...item,
                    addedAt: (item.addedAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString()
                })),
                createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
            } as Wishlist;
        });
        setWishlists(fetchedWishlists);
        setIsLoading(false);
      }, (err) => {
        console.error("Firestore error:", err);
        setError("Could not fetch your wishlists. Please try again later.");
        setIsLoading(false);
      });
      
      return () => unsubscribe();
    } else {
        setIsLoading(false);
    }
  }, [currentUser]);

  const handleCreateWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Please log in", description: "You must be logged in to create a wishlist.", variant: "destructive" });
      return;
    }
    if (!newWishlistName.trim()) {
        toast({ title: "Error", description: "Please enter a name for your new wishlist.", variant: "destructive" });
        return;
    }
    await addDoc(collection(db, 'MyWishlist'), {
      userId: currentUser.uid,
      name: newWishlistName,
      items: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setNewWishlistName('');
    setShowCreateForm(false);
    toast({ title: "Wishlist Created", description: `"${newWishlistName}" has been created.` });
  };
  
  const handleDeleteWishlist = async (id: string) => {
    const wishlistToDelete = wishlists.find(wl => wl.id === id);
    if (wishlistToDelete) {
        await deleteDoc(doc(db, 'MyWishlist', id));
        toast({ title: "Wishlist Deleted", description: `"${wishlistToDelete.name}" has been deleted.`, variant: "destructive" });
    }
  };

  const handleShareWishlist = (id: string) => {
    const wishlist = wishlists.find(wl => wl.id === id);
    if (wishlist) {
        const shareUrl = `${window.location.origin}/wishlist/${id}`; 
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({ title: "Link Copied!", description: `Share link for "${wishlist.name}" copied to clipboard.` });
        }).catch(err => {
            toast({ title: "Error", description: `Could not copy link. You can manually copy: ${shareUrl}`, variant: "destructive" });
        });
    }
  };

  const handleMoveToCart = async (wishlistId: string, productId: string) => {
    const productDetails = await getProductDetails(productId);
    if (productDetails) {
      if (productDetails.stock > 0 && productDetails.status === 'active') {
        addToCart(productDetails, 1); 
        await handleDeleteItemFromWishlist(wishlistId, productId, false); 
        toast({ title: "Moved to Cart", description: `"${productDetails.name}" moved to your cart.`});
      } else {
        toast({ title: "Item Unavailable", description: `"${productDetails.name}" is currently out of stock.`, variant: "destructive"});
      }
    } else {
      toast({ title: "Error", description: "Could not find product details to add to cart.", variant: "destructive"});
    }
  };
  
  const handleDeleteItemFromWishlist = async (wishlistId: string, productId: string, showToast: boolean = true) => {
      const wishlistRef = doc(db, 'MyWishlist', wishlistId);
      
      try {
        const wishlistSnap = await getDoc(wishlistRef);
        if (!wishlistSnap.exists()) {
          toast({ title: "Error", description: "Wishlist not found.", variant: "destructive" });
          return;
        }

        const wishlistData = wishlistSnap.data();
        const itemToRemove = wishlistData.items.find((item: any) => item.productId === productId);

        if (itemToRemove) {
          await updateDoc(wishlistRef, {
            items: arrayRemove(itemToRemove)
          });

          if (showToast) {
            toast({ title: "Item Removed", description: `"${itemToRemove.name}" removed from wishlist.`, variant: "destructive" });
          }
        }
      } catch (error) {
        console.error("Error removing item from wishlist:", error);
        toast({ title: "Error", description: "Could not remove item from wishlist.", variant: "destructive" });
      }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading your wishlists...</p>
        </div>
      );
    }
    
    if (error) {
       return (
         <Alert variant="destructive">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       );
    }
    
    if (!currentUser) {
       return (
         <Alert>
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Please Log In</AlertTitle>
           <AlertDescription>
             You need to be logged in to view your wishlists. <Link href="/login?redirect=/profile/wishlists" className="font-semibold text-primary hover:underline">Log in now</Link>.
           </AlertDescription>
         </Alert>
       );
    }

    if (wishlists.length === 0 && !showCreateForm) {
      return (
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your wishlists are empty.</p>
              <p className="text-sm text-muted-foreground">Create one to start saving your favorite items!</p>
            </CardContent>
          </Card>
      );
    }

    return wishlists.map((wishlist) => (
      <Card key={wishlist.id} className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{wishlist.name}</CardTitle>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Info", description: 'Edit wishlist name functionality to be implemented.'})}>
                  <Edit3 className="mr-1 h-3 w-3" /> Rename
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShareWishlist(wishlist.id)}>
                  <Share2 className="mr-1 h-3 w-3" /> Share
                </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteWishlist(wishlist.id)}>
                <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete Wishlist</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {wishlist.items.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">This wishlist is empty. Add some products from their product pages!</p>
          ) : (
            <div className="space-y-3">
              {wishlist.items.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-secondary/30 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <Image src={item.imageUrl || 'https://placehold.co/60x60.png'} alt={item.name} width={50} height={50} className="rounded-md object-cover aspect-square border" data-ai-hint={item.dataAiHint || 'wishlist item'} />
                    <div>
                      <Link href={`/products/${item.productId}`} passHref>
                          <p className="font-medium text-base hover:text-primary transition-colors">{item.name}</p>
                      </Link>
                      <p className="text-sm text-primary font-semibold">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => handleMoveToCart(wishlist.id, item.productId)} title="Move to Cart" className="hover:bg-green-100">
                          <ShoppingCart className="h-5 w-5 text-green-600 hover:text-green-700"/>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItemFromWishlist(wishlist.id, item.productId)} title="Remove from Wishlist" className="hover:bg-red-100">
                          <Trash2 className="h-5 w-5 text-destructive hover:text-red-700"/>
                      </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Separator className="my-4"/>
          <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              <li><strong>Create Named Lists:</strong> Organize items into unlimited lists (e.g., "Birthday Ideas", "Gadgets").</li>
              <li><strong>Move Items:</strong> Easily transfer items between different wishlists or directly to your shopping cart.</li>
              <li><strong>Share Wishlists:</strong> Generate a shareable link for your wishlists to send to friends and family.</li>
          </ul>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile Dashboard
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Heart className="mr-3 h-8 w-8" /> My Wishlists
        </h1>
        <p className="text-muted-foreground mt-1">
          Create and manage lists of your favorite items for future purchases or sharing.
        </p>
      </header>

      {currentUser && (
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="mb-6">
          <PlusCircle className="mr-2 h-4 w-4" /> {showCreateForm ? 'Cancel Creation' : 'Create New Wishlist'}
        </Button>
      )}

      {showCreateForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader><CardTitle>Create New Wishlist</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWishlist} className="flex items-center gap-2">
              <Input 
                type="text" 
                placeholder="Wishlist Name (e.g., Holiday Shopping)" 
                value={newWishlistName} 
                onChange={e => setNewWishlistName(e.target.value)} 
                className="input border p-2 rounded-md w-full text-sm flex-grow" 
                required 
              />
              <Button type="submit">Create List</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {renderContent()}
      </div>
    </div>
  );
}
