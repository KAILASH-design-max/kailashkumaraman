'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserCircle, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/shared/Logo';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/profile/orders', label: 'My Orders' },
  { href: '/profile/smart-list', label: 'Smart List' },
];

export function CustomerNavbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Mock cart item count
  const cartItemCount = 0; // Replace with actual cart count from state management

  const closeSheet = () => setIsSheetOpen(false);

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
                <Logo textSize="text-xl" iconSize={28} className="mb-4 px-2"/>
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} passHref>
                    <Button
                      variant={pathname === link.href ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={closeSheet}
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
                 <Link href="/auth/login" passHref>
                    <Button variant='outline' className="w-full justify-start" onClick={closeSheet}>
                        <UserCircle className="mr-2 h-5 w-5" />
                        Login / Sign Up
                    </Button>
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
             <Logo textSize="text-lg" iconSize={24} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.slice(0,2).map((link) => ( // Show only Home and Products directly for brevity
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
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="relative w-full max-w-xs hidden sm:block">
            <Input type="search" placeholder="Search products..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/auth/login">
              <UserCircle className="mr-2 h-5 w-5" />
              Login / Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
