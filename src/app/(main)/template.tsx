// src/app/(main)/template.tsx
'use client';
import { CartProvider } from '@/hooks/useCart';

export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
