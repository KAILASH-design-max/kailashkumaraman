
'use client';

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/components/providers/CartProvider';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { usePathname } from 'next/navigation';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <CartProvider>
      {!isAuthPage && <CustomerNavbar />}
      {children}
      <Toaster />
    </CartProvider>
  );
}
