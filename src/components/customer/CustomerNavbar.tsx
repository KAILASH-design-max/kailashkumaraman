
'use client';

import Link from 'next/link';
import { ShoppingCartIcon, Menu, LogOut, User, Settings, ListOrdered, Search as SearchIcon, ChevronDown, UserCircle } from 'lucide-react';
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
import { LocationDialog } from '@/components/shared/LocationDialog';

// Desktop nav links are removed from here to match the new design
// They will remain in the mobile sheet content.
const mainSheetNavItems: { href: string; label: string; icon?: React.ElementType }[] = [
  { href: '/profile/orders', label: 'My Orders', icon: ListOrdered },
  { href: '/profile/smart-list', label: 'Smart List', icon: Settings },
  // You can add other general links like '/products' if needed in mobile
  { href: '/products', label: 'All Products' },
];


const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedInStatus = typeof window !== 'undefined' && localStorage.getItem('isMockLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    const handleStorageChange = () => {
        const currentLoggedInStatus = localStorage.getItem('isMockLoggedIn') === 'true';
        if (isLoggedIn !== currentLoggedInStatus) {
            setIsLoggedIn(currentLoggedInStatus);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    // Also check on focus in case local storage was changed in another tab
    window.addEventListener('focus', handleStorageChange); 

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleStorageChange);
    };
  }, [isLoggedIn]); // Add isLoggedIn to dependency array to re-run if it changes programmatically


  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('isMockLoggedIn');
    setIsLoggedIn(false);
  };
  return { isLoggedIn, logout }; // Removed login as it's not used here
};


export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isLoggedIn, logout: performLogout } = useAuth();
  const { getTotalItems, getCartTotal } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [deliveryTime, setDeliveryTime] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState("Daryaganj, Delhi, 110002, India");
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const calculateDeliveryTime = () => {
    return Math.floor(Math.random() * 21) + 10; // Random time 10-30 mins
  };

  useEffect(() => {
    // Calculate delivery time only on the client-side after mount
    setDeliveryTime(calculateDeliveryTime());
  }, []);

  const handleLocationUpdate = (newLocation: string) => {
    setCurrentLocation(newLocation);
    setDeliveryTime(calculateDeliveryTime()); 
    setIsLocationDialogOpen(false);
  };

  const cartItemCount = getTotalItems();
  const cartTotalAmount = getCartTotal();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    performLogout();
    router.push('/');
    closeSheet();
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search term after submit
      closeSheet(); 
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* --- Mobile Menu --- */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="md:hidden mr-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
            <SheetClose asChild>
                <Logo textSize="text-xl" className="mb-4 p-2 border-b"/>
            </SheetClose>
            <nav className="flex flex-col gap-2 mt-4 flex-grow">
              {mainSheetNavItems.map((link) => ( // Using mainSheetNavItems for mobile
                <SheetClose asChild key={link.label}>
                  <Link href={link.href} passHref>
                    <Button
                      variant={pathname === link.href ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-md py-3"
                    >
                      {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                      {link.label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4">
              {isLoggedIn ? (
                <>
                  <SheetClose asChild>
                    <Link href="/profile" passHref>
                      <Button variant='ghost' className="w-full justify-start text-md py-3">
                          <User className="mr-2 h-5 w-5" />
                          My Profile
                      </Button>
                    </Link>
                  </SheetClose>
                  <Button variant='outline' className="w-full justify-start text-md py-3" onClick={handleLogout}>
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                  </Button>
                </>
              ) : (
                <SheetClose asChild>
                   <Link href="/auth/login" passHref>
                      <Button variant='default' className="w-full justify-start text-md py-3">
                          <User className="mr-2 h-5 w-5" />
                          Login / Sign Up
                      </Button>
                    </Link>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* --- Desktop View --- */}
        {/* Left Section: Logo and Delivery Info */}
        <div className="hidden md:flex items-center space-x-6 flex-shrink-0"> {/* Increased space-x-4 to space-x-6 */}
          <Logo textSize="text-3xl" /> 
          
          <LocationDialog 
              open={isLocationDialogOpen} 
              onOpenChange={setIsLocationDialogOpen}
              onLocationUpdate={handleLocationUpdate}
          >
              <div className="flex items-center cursor-pointer group">
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {deliveryTime !== null ? `Delivery in ${deliveryTime} minutes` : 'Checking...'}
                  </p>
                  <div className="flex items-center">
                    <p className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[200px] md:max-w-[150px] lg:max-w-[200px]">
                      {currentLocation}
                    </p>
                    <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>
              </div>
          </LocationDialog>
        </div>
        
        {/* Mobile Logo (appears next to hamburger if needed, if desktop logo is hidden first) */}
         <div className="md:hidden flex-1"> {/* Use flex-1 to push cart to the right on mobile if search is not there */}
            <Logo textSize="text-xl" href="/" className="ml-2" />
        </div>


        {/* Middle Section: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-lg"> {/* Max width for search bar */}
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder='Search "butter"'
              className="h-11 w-full pl-10 pr-4 rounded-lg border-gray-300 focus:border-primary focus:ring-primary" // Adjusted padding and style
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Right Section: Login and Cart (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
           {isLoggedIn ? (
             <Link href="/profile" passHref>
               <Button variant="ghost" size="icon" aria-label="My Profile">
                  <UserCircle className="h-7 w-7" />
               </Button>
             </Link>
           ) : (
            <Link href="/auth/login" passHref>
              <Button variant="ghost" size="icon" aria-label="Login or Sign up">
                 <UserCircle className="h-7 w-7" />
              </Button>
            </Link>
           )}

          <Button 
            onClick={() => router.push('/cart')}
            style={{ backgroundColor: '#5B8C28' }}
            className="text-white hover:bg-green-700 px-4 py-2 h-11 rounded-md text-sm"
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            <div className="flex flex-col items-start -my-1"> {/* Adjusted for two lines */}
              <span className="text-xs leading-tight">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</span>
              <span className="font-semibold leading-tight">₹{cartTotalAmount.toFixed(2)}</span>
            </div>
          </Button>
        </div>

        {/* Cart Icon (Mobile - if search bar is not shown, or as a fallback) */}
        <div className="md:hidden ml-auto">
             <Button variant="ghost" size="icon" asChild className="relative">
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
       {/* Search Bar (Mobile - below header, centered) */}
       <div className="md:hidden px-4 pb-3 pt-1 border-b">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder='Search "butter"'
              className="h-10 w-full pl-9 pr-4 rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products mobile"
            />
          </div>
        </div>
    </header>
  );
}
