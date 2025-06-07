
'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserCircle, Search, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/shared/Logo';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from 'react';
import { useCart } from '@/hooks/useCart'; // Import useCart

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  // "My Orders" and "Smart List" are conditional or might be better suited inside a user profile dropdown later
];

export function CustomerNavbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const { getTotalItems } = useCart();

  const cartItemCount = getTotalItems();

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    // In a real app, you'd call an authentication service here
    setIsLoggedIn(false);
    // Optionally, redirect to home or login page
    // router.push('/');
    closeSheet();
  };
  
  // This function is for demonstration if we had a login button directly in the navbar
  // const handleLogin = () => {
  //   setIsLoggedIn(true); 
  //   closeSheet();
  // };

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
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                    <Logo textSize="text-xl" iconSize={28} className="mb-4 px-2"/>
                </SheetClose>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link href={link.href} passHref>
                      <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                {isLoggedIn && (
                  <>
                    <SheetClose asChild>
                      <Link href="/profile/orders" passHref>
                        <Button variant={pathname === "/profile/orders" ? 'secondary' : 'ghost'} className="w-full justify-start">
                          My Orders
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/profile/smart-list" passHref>
                        <Button variant={pathname === "/profile/smart-list" ? 'secondary' : 'ghost'} className="w-full justify-start">
                           Smart List
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
                <hr className="my-2"/>
                {isLoggedIn ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/profile" passHref>
                        <Button variant='ghost' className="w-full justify-start">
                            <User className="mr-2 h-5 w-5" />
                            My Profile
                        </Button>
                      </Link>
                    </SheetClose>
                    <Button variant='outline' className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                  </>
                ) : (
                  <SheetClose asChild>
                     <Link href="/auth/login" passHref>
                        <Button variant='outline' className="w-full justify-start">
                            <UserCircle className="mr-2 h-5 w-5" />
                            Login / Sign Up
                        </Button>
                      </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
             <Logo textSize="text-lg" iconSize={24} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => ( 
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
           {isLoggedIn && (
            <>
              <Link
                href="/profile/orders"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/profile/orders" ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                My Orders
              </Link>
              <Link
                href="/profile/smart-list"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/profile/smart-list" ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Smart List
              </Link>
            </>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="relative w-full max-w-xs hidden sm:block">
            <Input type="search" placeholder="Search products..." className="pl-10 h-10" aria-label="Search products"/>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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
                  <User className="mr-2 h-5 w-5" />
                  My Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
              <Link href="/auth/login">
                <UserCircle className="mr-2 h-5 w-5" />
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
