
'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserCircle, Menu, LogOut, User, Settings, ListOrdered, Search as SearchIcon } from 'lucide-react';
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

const navLinks: { href: string; label: string; icon?: React.ElementType }[] = [
  // { href: '/', label: 'Home' },
  // { href: '/products', label: 'Products' },
];

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedInStatus = typeof window !== 'undefined' && localStorage.getItem('isMockLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const login = () => {
    if (typeof window !== 'undefined') localStorage.setItem('isMockLoggedIn', 'true');
    setIsLoggedIn(true);
  };
  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('isMockLoggedIn');
    setIsLoggedIn(false);
  };
  return { isLoggedIn, login, logout };
};


export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isLoggedIn, logout: performLogout } = useAuth();
  const { getTotalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const cartItemCount = getTotalItems();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    performLogout();
    router.push('/');
    closeSheet();
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      closeSheet(); // Close sheet if open after search
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const mainNavItems = [
    ...(isLoggedIn ? [
      { href: '/profile/orders', label: 'My Orders', icon: ListOrdered },
      { href: '/profile/smart-list', label: 'Smart List', icon: Settings },
    ] : []),
    ...navLinks,
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Left part: Mobile Menu toggle and Desktop Logo + Nav */}
        <div className="flex items-center flex-shrink-0">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden mr-2">
              <Button variant="ghost" size="icon">
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

          <div className="hidden md:flex items-center">
            <Logo textSize="text-xl" iconSize={28} className="ml-2 mr-6" />
            <nav className="flex items-center space-x-4 text-sm font-medium">
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
          </div>

          <div className="md:hidden">
             <Logo textSize="text-lg" iconSize={24} href="/" className="ml-2" />
          </div>
        </div>

        {/* Middle part: Search Bar */}
        <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-20 mr-2">
          <div className="relative w-full max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search for products..."
              className="h-10 w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              onClick={handleSearchSubmit}
              aria-label="Submit search"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right part: Actions (Cart, Profile/Login) */}
        <div className="flex items-center space-x-2 flex-shrink-0">
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
