
'use client';

import Link from 'next/link';
import { ShoppingCartIcon, Menu, LogOut, User, Settings, ListOrdered, Search as SearchIcon, ChevronDown, UserCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState, useEffect, type KeyboardEvent } from 'react';
import { useCart } from '@/hooks/useCart';
import { Input } from '@/components/ui/input';
import { LocationDialog, type Location } from '@/components/shared/LocationDialog';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

interface DarkStore {
  id: string;
  name: string;
  lat: number;
  lng: number;
  active: boolean;
}

const mockDarkStores: DarkStore[] = [
    { id: 'ds1', name: 'Darbhanga Central', lat: 26.17, lng: 85.9, active: true },
    { id: 'ds2', name: 'Laheriasarai South', lat: 26.10, lng: 85.91, active: true },
    { id: 'ds3', name: 'Muzaffarpur Hub', lat: 26.12, lng: 85.36, active: false }, // Inactive store
    { id: 'ds4', name: 'Samastipur East', lat: 25.86, lng: 85.78, active: true },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function estimateDeliveryTime(distanceKm: number): string {
    if (distanceKm <= 2) return "15–20 minutes";
    if (distanceKm <= 5) return "20–30 minutes";
    if (distanceKm <= 10) return "30–45 minutes";
    return "Not Serviceable";
}

const mainSheetNavItems: { href: string; label: string; icon?: React.ElementType }[] = [
  { href: '/profile/orders', label: 'My Orders', icon: ListOrdered },
  { href: '/profile/smart-list', label: 'Smart List', icon: Settings },
  { href: '/products', label: 'All Products' },
];

const useFirebaseAuth = () => { 
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
      setTimeout(() => window.location.reload(), 200); // Force reload
    } catch (error) {
      console.error("Logout Error:", error);
      toast({ title: 'Logout Failed', description: 'An error occurred during logout.', variant: 'destructive' });
    }
  };
  
  return { 
    currentUser,
    isLoggedIn: !!currentUser, 
    logout, 
    isLoading 
  };
};


export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currentUser, isLoggedIn, logout: performLogout, isLoading: authIsLoading } = useFirebaseAuth();
  const { getTotalItems, getCartTotal } = useCart();
  const searchPlaceholder = "Search for atta, dal, coke...";

  const [deliveryTime, setDeliveryTime] = useState<string>('Calculating...');
  const [currentLocation, setCurrentLocation] = useState<Location>({ name: "Darbhanga, Bihar", lat: 26.17, lng: 85.9 });
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
  useEffect(() => {
    // This simulates fetching stores and calculating distance on location change
    const activeStores = mockDarkStores.filter(store => store.active);
    if (activeStores.length === 0) {
        setDeliveryTime('No stores available');
        return;
    }

    let nearestStoreDist = Infinity;
    for (const store of activeStores) {
        const distance = haversineDistance(currentLocation.lat, currentLocation.lng, store.lat, store.lng);
        if (distance < nearestStoreDist) {
            nearestStoreDist = distance;
        }
    }

    setDeliveryTime(estimateDeliveryTime(nearestStoreDist));

  }, [currentLocation]);

  const handleLocationUpdate = (newLocation: Location) => {
    setCurrentLocation(newLocation);
    if (typeof window !== 'undefined') {
      setIsLocationDialogOpen(false);
    }
  };

  const cartItemCount = getTotalItems();
  const cartTotalAmount = getCartTotal();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = async () => {
    await performLogout();
    closeSheet();
  };
  
  const SearchBarTrigger = ({ isMobile = false }) => {
    const baseClasses = "relative w-full cursor-pointer";
    const mobileClasses = "h-10 text-sm pl-9 pr-4 rounded-md border border-input";
    const desktopClasses = "h-11 pl-10 pr-4 rounded-lg border border-input";
  
    return (
      <div className={baseClasses} onClick={() => router.push('/search')}>
        <SearchIcon className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", isMobile ? "h-4 w-4" : "h-5 w-5")} />
        <div className={cn("bg-background flex items-center text-muted-foreground", isMobile ? mobileClasses : desktopClasses)}>
            {searchPlaceholder}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden mr-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetClose asChild>
                  <Logo icon={ShoppingCartIcon} textSize="text-xl" className="mb-4 p-2 border-b"/>
              </SheetClose>
              <nav className="flex flex-col gap-2 mt-4 flex-grow">
                {mainSheetNavItems.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Button asChild variant={pathname === link.href ? 'secondary' : 'ghost'} className="w-full justify-start text-md py-3">
                      <Link href={link.href}>
                        {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                        {link.label}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                {!authIsLoading && (
                  isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Button asChild variant='ghost' className="w-full justify-start text-md py-3">
                          <Link href="/profile">
                              <User className="mr-2 h-5 w-5" />
                              {currentUser?.displayName || currentUser?.email || 'My Profile'}
                          </Link>
                        </Button>
                      </SheetClose>
                      <Button variant='outline' className="w-full justify-start text-md py-3" onClick={handleLogout}>
                          <LogOut className="mr-2 h-5 w-5" />
                          Logout
                      </Button>
                    </>
                  ) : (
                    <SheetClose asChild>
                       <Button asChild variant='default' className="w-full justify-start text-md py-3">
                          <Link href="/login">
                              <User className="mr-2 h-5 w-5" />
                              Login / Sign Up
                          </Link>
                        </Button>
                    </SheetClose>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <Logo icon={ShoppingCartIcon} textSize="text-3xl" iconSize={30} />

            <LocationDialog
                open={isLocationDialogOpen}
                onOpenChange={setIsLocationDialogOpen}
                onLocationUpdate={handleLocationUpdate}
            >
                <div className="flex items-center cursor-pointer group">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                      Delivery in {deliveryTime}
                    </p>
                    <div className="flex items-center">
                      <p className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[200px] md:max-w-[150px] lg:max-w-[200px]">
                        {currentLocation.name}
                      </p>
                      <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                </div>
            </LocationDialog>
          </div>

           <div className="md:hidden flex-1">
              <Logo icon={ShoppingCartIcon} textSize="text-xl" href="/" className="ml-2" iconSize={24}/>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-2">
            <div className="w-full max-w-lg">
                <SearchBarTrigger />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
             {!authIsLoading && (
               isLoggedIn ? (
                 <Button asChild variant="ghost" className="px-3 py-2 h-11 text-sm">
                   <Link href="/profile">
                      {currentUser?.displayName || currentUser?.email || 'Profile'}
                   </Link>
                 </Button>
               ) : (
                <Button asChild variant="ghost" className="px-3 py-2 h-11 text-sm">
                  <Link href="/login">
                     Login
                  </Link>
                </Button>
               )
             )}

            <Button
              onClick={() => router.push('/cart')}
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-11 rounded-md text-sm",
                cartItemCount === 0 ? 'cart-empty' : 'cart-active'
              )}
              aria-disabled={cartItemCount === 0}
            >
              <ShoppingCartIcon className="mr-2 h-5 w-5" />
              <div className="flex flex-col items-start -my-1">
                <span className="text-xs leading-tight">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</span>
                <span className="font-semibold leading-tight">₹{getCartTotal().toFixed(2)}</span>
              </div>
            </Button>
          </div>

          <div className="md:hidden ml-auto">
               <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className={cn(
                    "relative",
                    cartItemCount === 0 ? 'cart-empty' : 'cart-active'
                  )}
                  aria-disabled={cartItemCount === 0}
                >
                  <Link href="/cart" aria-label="Shopping Cart">
                  <ShoppingCartIcon className="h-5 w-5" />
                  {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {cartItemCount}
                      </span>
                  )}
                  <span className="sr-only">Cart</span>
                  </Link>
              </Button>
          </div>
        </div>

        {/* Mobile Location Display */}
        <div className="md:hidden container mx-auto px-4 pt-2 pb-2 text-center border-b border-t">
            <LocationDialog
                open={isLocationDialogOpen}
                onOpenChange={setIsLocationDialogOpen}
                onLocationUpdate={handleLocationUpdate}
            >
                <div className="inline-flex items-center cursor-pointer group p-1 hover:bg-muted rounded-md transition-colors">
                  <div className="text-left">
                    <p className="text-xs font-medium text-foreground whitespace-nowrap">
                      Delivery in {deliveryTime}
                    </p>
                    <div className="flex items-center">
                      <p className="text-[11px] text-muted-foreground truncate max-w-[200px] xs:max-w-[240px]">
                        {currentLocation.name}
                      </p>
                      <ChevronDown className="h-3 w-3 text-muted-foreground ml-1 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                </div>
            </LocationDialog>
        </div>
        
        {/* Mobile Search Bar */}
         <div className="md:hidden px-4 pb-3 pt-2">
            <SearchBarTrigger isMobile={true}/>
          </div>
      </header>

      {/* Mobile Fixed Cart Summary Box */}
      {cartItemCount > 0 && (
        <Link
          href="/cart"
          className="md:hidden fixed bottom-4 left-4 z-50 bg-green-600 text-white p-3 pr-4 rounded-lg shadow-xl flex items-center space-x-3 cursor-pointer hover:bg-green-700 active:bg-green-800 transition-all transform hover:scale-105 active:scale-100"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <div className="flex-grow">
            <p className="text-sm font-semibold leading-tight">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</p>
            <p className="text-xs leading-tight">₹{cartTotalAmount.toFixed(2)}</p>
          </div>
          <div className="text-sm font-medium flex items-center">
            View Cart
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      )}
    </>
  );
}
