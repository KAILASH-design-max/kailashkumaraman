
'use client';

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/components/providers/CartProvider';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { usePathname } from 'next/navigation';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = authRoutes.includes(pathname);
  const isSearchPage = pathname === '/search';

  return (
    <CartProvider>
      {!isAuthPage && !isSearchPage && <CustomerNavbar />}
      {children}
      <Toaster />
    </CartProvider>
  );
}
