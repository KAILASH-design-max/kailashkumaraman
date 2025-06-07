
'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserCircle, Menu, LogOut, User, Settings, ListOrdered } from 'lucide-react'; // Added Settings, ListOrdered
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { usePathname, useRouter } from 'next/navigation'; 
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react'; // Added useEffect
import { useCart } from '@/hooks/useCart';

const navLinks: { href: string; label: string; icon?: React.ElementType }[] = [
  // { href: '/', label: 'Home' }, // Maintained as removed
  // { href: '/products', label: 'Products' }, // Maintained as removed
];

// Representing user's login state; in a real app, this would come from auth context/store
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Simulate checking auth status on mount
  useEffect(() => {
    // Replace with actual auth check, e.g., checking localStorage, cookie, or calling an API
    const loggedInStatus = localStorage.getItem('isMockLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const login = () => {
    localStorage.setItem('isMockLoggedIn', 'true');
    setIsLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem('isMockLoggedIn');
    setIsLoggedIn(false);
  };
  return { isLoggedIn, login, logout };
};


export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isLoggedIn, logout: performLogout } = useAuth(); // Using the mock auth hook
  const { getTotalItems } = useCart();

  const cartItemCount = getTotalItems();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    performLogout(); 
    router.push('/'); 
    closeSheet();
    // Optionally, add a toast message for logout confirmation
  };
  
  const mainNavItems = [
    ...(isLoggedIn ? [
      { href: '/profile/orders', label: 'My Orders', icon: ListOrdered },
      { href: '/profile/smart-list', label: 'Smart List', icon: Settings }, // Example icon
    ] : []),
    ...navLinks, // Other general links if any
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo textSize="text-xl" iconSize={28} />
        </div>
        
        {/* Mobile Menu and Logo */}
        <div className="md:hidden flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetClose asChild>
                  <Logo textSize="text-xl" iconSize={28} className="mb-4 p-2 border-b"/>
              </SheetClose>
              <nav className="flex flex-col gap-2 mt-4 flex-grow">
                {mainNavItems.map((link) => (
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
                            <UserCircle className="mr-2 h-5 w-5" />
                            Login / Sign Up
                        </Button>
                      </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
             <Logo textSize="text-lg" iconSize={24} href="/" /> 
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {mainNavItems.map((link) => ( 
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 flex items-center ${
                pathname === link.href ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
            >
              {link.icon && <link.icon className="mr-1.5 h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" /> 
                  My Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
              <Link href="/auth/login">
                <UserCircle className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

