
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Heart, Edit3, Trash2, PlusCircle, Share2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string; // Wishlist Item ID
  productId: string; // Product ID from mockProducts
  name: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
}

interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
}

const getProductDetails = (productId: string): Product | undefined => {
  return mockProducts.find(p => p.id === productId);
};


export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    { 
      id: 'wl1', 
      name: 'Birthday Ideas 🎂', 
      items: [
        { id: 'wli1', productId: mockProducts[5].id, name: mockProducts[5].name, price: mockProducts[5].price, imageUrl: mockProducts[5].imageUrl, dataAiHint: mockProducts[5].dataAiHint },
        { id: 'wli2', productId: mockProducts[6].id, name: mockProducts[6].name, price: mockProducts[6].price, imageUrl: mockProducts[6].imageUrl, dataAiHint: mockProducts[6].dataAiHint },
      ] 
    },
    { id: 'wl2', name: 'Kitchen Essentials 🍳', items: [
        { id: 'wli3', productId: mockProducts[7].id, name: mockProducts[7].name, price: mockProducts[7].price, imageUrl: mockProducts[7].imageUrl, dataAiHint: mockProducts[7].dataAiHint },
    ] },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleCreateWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
        toast({ title: "Error", description: "Please enter a name for your new wishlist.", variant: "destructive" });
        return;
    }
    const newWishlist: Wishlist = { id: `wl${Date.now()}`, name: newWishlistName, items: [] };
    setWishlists(prev => [...prev, newWishlist]);
    setNewWishlistName('');
    setShowCreateForm(false);
    toast({ title: "Wishlist Created", description: `"${newWishlistName}" has been created.` });
  };
  
  const handleDeleteWishlist = (id: string) => {
    const wishlistToDelete = wishlists.find(wl => wl.id === id);
    setWishlists(prev => prev.filter(wl => wl.id !== id));
    if (wishlistToDelete) {
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

  const handleMoveToCart = (wishlistId: string, itemId: string) => {
    const wishlist = wishlists.find(wl => wl.id === wishlistId);
    if (!wishlist) return;

    const itemToMove = wishlist.items.find(item => item.id === itemId);
    if (!itemToMove) return;

    const productDetails = getProductDetails(itemToMove.productId);
    if (productDetails) {
      addToCart(productDetails, 1); 
      handleDeleteItemFromWishlist(wishlistId, itemId, false); 
      toast({ title: "Moved to Cart", description: `"${itemToMove.name}" moved to your cart.`});
    } else {
      toast({ title: "Error", description: "Could not find product details to add to cart.", variant: "destructive"});
    }
  };
  
  const handleDeleteItemFromWishlist = (wishlistId: string, itemId: string, showToast: boolean = true) => {
    let itemName = "";
    setWishlists(prev => prev.map(wl => {
        if (wl.id === wishlistId) {
            const itemToDelete = wl.items.find(item => item.id === itemId);
            if(itemToDelete) itemName = itemToDelete.name;
            return { ...wl, items: wl.items.filter(item => item.id !== itemId) };
        }
        return wl;
    }));

    if (showToast && itemName) {
         toast({ title: "Item Removed", description: `"${itemName}" removed from wishlist.`, variant: "destructive" });
    }
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

      <Button onClick={() => setShowCreateForm(!showCreateForm)} className="mb-6">
        <PlusCircle className="mr-2 h-4 w-4" /> {showCreateForm ? 'Cancel Creation' : 'Create New Wishlist'}
      </Button>

      {showCreateForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader><CardTitle>Create New Wishlist</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWishlist} className="flex items-center gap-2">
              <input 
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
        {wishlists.length === 0 && !showCreateForm ? (
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your wishlists are empty.</p>
              <p className="text-sm text-muted-foreground">Create one to start saving your favorite items!</p>
            </CardContent>
          </Card>
        ) : (
          wishlists.map((wishlist) => (
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
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-secondary/30 hover:shadow-md transition-shadow">
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
                           <Button variant="ghost" size="icon" onClick={() => handleMoveToCart(wishlist.id, item.id)} title="Move to Cart" className="hover:bg-green-100">
                                <ShoppingCart className="h-5 w-5 text-green-600 hover:text-green-700"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItemFromWishlist(wishlist.id, item.id)} title="Remove from Wishlist" className="hover:bg-red-100">
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
          ))
        )}
      </div>
    </div>
  );
}
