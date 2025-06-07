
'use client';

import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
// CartProvider is removed from here as it's now in the RootLayout

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <CartProvider> No longer needed here
      <div className="flex min-h-screen flex-col">
        <CustomerNavbar />
        <main className="flex-1">{children}</main>
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by SpeedyShop Proto Team. &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    // </CartProvider>
  );
}
