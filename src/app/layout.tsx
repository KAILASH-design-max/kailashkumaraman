
'use client'; // Make RootLayout a client component for CartProvider

// Removed Metadata import as it's no longer used directly for export
// import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { CartProvider } from '@/components/providers/CartProvider'; // Import CartProvider

// Note: Metadata export is NOT supported in client components at the root level.
// We remove it to fix the build error. Global metadata would need to be handled
// differently if this layout remains client-side (e.g. via page.tsx or custom head tags).
// export const metadata: Metadata = {
// title: 'SpeedyShop Proto',
// description: 'Quick-Commerce Platform Prototype',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can add static meta tags here directly if needed, or manage title via useEffect */}
        <title>SpeedyShop Proto</title>
        <meta name="description" content="Quick-Commerce Platform Prototype" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider> {/* Wrap children with CartProvider */}
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
