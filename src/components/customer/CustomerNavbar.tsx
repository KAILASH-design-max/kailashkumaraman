
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

const mainSheetNavItems: { href: string; label: string; icon?: React.ElementType }[] = [
  { href: '/profile/orders', label: 'My Orders', icon: ListOrdered },
  { href: '/profile/smart-list', label: 'Smart List', icon: Settings },
  { href: '/products', label: 'All Products' },
];


const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to a server-renderable default

  useEffect(() => {
    // This runs only on the client after hydration
    const checkAuthStatus = () => {
      const loggedInStatus = localStorage.getItem('isMockLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    };

    checkAuthStatus(); // Initial check on mount

    window.addEventListener('storage', checkAuthStatus); // Listen for changes in other tabs
    window.addEventListener('focus', checkAuthStatus); // Listen for when window regains focus

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('focus', checkAuthStatus);
    };
  }, []); // Empty dependency array ensures this runs once on mount client-side

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('isMockLoggedIn');
    setIsLoggedIn(false); // Update state immediately
  };
  return { isLoggedIn, logout };
};


export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isLoggedIn, logout: performLogout } = useAuth();
  const { getTotalItems, getCartTotal } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const [deliveryTime, setDeliveryTime] = useState<number | null>(null); // Initialize to null
  const [currentLocation, setCurrentLocation] = useState("Daryaganj, Delhi, 110002, India");
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const calculateDeliveryTime = () => {
    return Math.floor(Math.random() * 21) + 10;
  };

  useEffect(() => {
    // Set delivery time on the client side after mount
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
      setSearchTerm('');
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
              {isLoggedIn ? (
                <>
                  <SheetClose asChild>
                    <Button asChild variant='ghost' className="w-full justify-start text-md py-3">
                      <Link href="/profile">
                          <User className="mr-2 h-5 w-5" />
                          My Profile
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
                      <Link href="/auth/login">
                          <User className="mr-2 h-5 w-5" />
                          Login / Sign Up
                      </Link>
                    </Button>
                </SheetClose>
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

         <div className="md:hidden flex-1">
            <Logo icon={ShoppingCartIcon} textSize="text-xl" href="/" className="ml-2" iconSize={24}/>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 mr-2">
          <div className="relative w-full max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder='Search "butter"'
              className="h-11 w-full pl-10 pr-4 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
           {isLoggedIn ? (
             <Button asChild variant="ghost" className="px-3 py-2 h-11 text-sm">
               <Link href="/profile">
                  Profile
               </Link>
             </Button>
           ) : (
            <Button asChild variant="ghost" className="px-3 py-2 h-11 text-sm">
              <Link href="/auth/login">
                 Login
              </Link>
            </Button>
           )}

          <Button
            onClick={() => router.push('/cart')}
            style={{ backgroundColor: '#5B8C28' }}
            className="text-white hover:bg-green-700 px-4 py-2 h-11 rounded-md text-sm"
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            <div className="flex flex-col items-start -my-1">
              <span className="text-xs leading-tight">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</span>
              <span className="font-semibold leading-tight">₹{cartTotalAmount.toFixed(2)}</span>
            </div>
          </Button>
        </div>

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
