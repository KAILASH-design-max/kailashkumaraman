
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Heart, Edit3, Trash2, PlusCircle, Share2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/lib/mockData'; // Assuming mockProducts are available

interface WishlistItem {
  id: string;
  productId: string;
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

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    { 
      id: 'wl1', 
      name: 'Birthday Ideas 🎂', 
      items: [
        { id: 'wli1', productId: mockProducts[5].id, name: mockProducts[5].name, price: mockProducts[5].price, imageUrl: mockProducts[5].imageUrls[0].url, dataAiHint: mockProducts[5].imageUrls[0].dataAiHint },
        { id: 'wli2', productId: mockProducts[6].id, name: mockProducts[6].name, price: mockProducts[6].price, imageUrl: mockProducts[6].imageUrls[0].url, dataAiHint: mockProducts[6].imageUrls[0].dataAiHint },
      ] 
    },
    { id: 'wl2', name: 'Kitchen Essentials 🍳', items: [
        { id: 'wli3', productId: mockProducts[7].id, name: mockProducts[7].name, price: mockProducts[7].price, imageUrl: mockProducts[7].imageUrls[0].url, dataAiHint: mockProducts[7].imageUrls[0].dataAiHint },
    ] },
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');

  const handleCreateWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
        alert("Please enter a name for your new wishlist.");
        return;
    }
    const newWishlist: Wishlist = { id: `wl${Date.now()}`, name: newWishlistName, items: [] };
    setWishlists(prev => [...prev, newWishlist]);
    setNewWishlistName('');
    setShowCreateForm(false);
    // API call to create wishlist
  };
  
  const handleDeleteWishlist = (id: string) => {
    setWishlists(prev => prev.filter(wl => wl.id !== id));
    // API call to delete wishlist
  };

  const handleShareWishlist = (id: string) => {
    const wishlist = wishlists.find(wl => wl.id === id);
    if (wishlist) {
        const shareUrl = `${window.location.origin}/wishlist/${id}`; // Example share URL
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert(`Share link for "${wishlist.name}" copied to clipboard!\n${shareUrl}`);
        }).catch(err => {
            alert(`Could not copy link. You can manually copy: ${shareUrl}`);
        });
    }
  };

  const handleMoveToCart = (wishlistId: string, itemId: string) => {
    alert(`Item ${itemId} from wishlist ${wishlistId} would be moved to cart (functionality to be implemented).`);
    // Actual logic would involve removing from wishlist state and adding to cart context/state
  };
  
  const handleDeleteItemFromWishlist = (wishlistId: string, itemId: string) => {
    setWishlists(prev => prev.map(wl => {
        if (wl.id === wishlistId) {
            return { ...wl, items: wl.items.filter(item => item.id !== itemId) };
        }
        return wl;
    }));
    // API call to remove item
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
          <p>You have no wishlists. Create one to start saving your favorite items!</p>
        ) : (
          wishlists.map((wishlist) => (
            <Card key={wishlist.id} className="shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{wishlist.name}</CardTitle>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={() => alert('Edit wishlist name functionality to be implemented.')}>
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
                  <p className="text-sm text-muted-foreground">This wishlist is empty. Add some products!</p>
                ) : (
                  <div className="space-y-3">
                    {wishlist.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded object-cover aspect-square" data-ai-hint={item.dataAiHint || 'wishlist item'} />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-primary">₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                           <Button variant="ghost" size="icon" onClick={() => handleMoveToCart(wishlist.id, item.id)} title="Move to Cart">
                                <ShoppingCart className="h-4 w-4 text-green-600"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItemFromWishlist(wishlist.id, item.id)} title="Remove from Wishlist">
                                <Trash2 className="h-4 w-4 text-destructive"/>
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
