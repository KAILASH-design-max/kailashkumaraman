'use client';

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/components/providers/CartProvider';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { usePathname } from 'next/navigation';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isSearchPage = pathname === '/search';

  return (
    <CartProvider>
      {!isAuthPage && !isSearchPage && <CustomerNavbar />}
      {children}
      <Toaster />
    </CartProvider>
  );
}
