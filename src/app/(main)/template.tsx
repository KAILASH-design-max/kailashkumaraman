// src/app/(main)/template.tsx
'use client';
import { CartProvider } from '@/components/providers/CartProvider'; // Updated import path
import type React from 'react';

export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
