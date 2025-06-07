// src/hooks/useCart.ts
'use client';

import React, { useState, useEffect, createContext, useContext, type PropsWithChildren } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('speedyShopCart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error("Stored cart is not an array, resetting.");
          localStorage.setItem('speedyShopCart', JSON.stringify([])); 
          setCartItems([]);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.setItem('speedyShopCart', JSON.stringify([])); 
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('speedyShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: Math.max(0, item.quantity + quantity) } : item
        );
      }
      return quantity > 0 ? [...prevItems, { ...product, quantity }] : prevItems;
    });
    if (quantity > 0) {
      toast({
        title: `${product.name} added to cart!`,
        description: `Quantity: ${quantity}`,
      });
    }
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (itemToRemove) {
      toast({
        title: `${itemToRemove.name} removed from cart.`,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemToUpdate = cartItems.find(item => item.id === productId);
    if (quantity <= 0) {
      if (itemToUpdate) {
        removeFromCart(productId); 
      } else {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

     if (itemToUpdate) {
        toast({
            title: `${itemToUpdate.name} quantity updated.`,
            description: `New quantity: ${quantity}`,
        });
     }
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
        setCartItems([]);
        toast({
            title: "Cart cleared!",
            description: "Your shopping cart is now empty.",
        });
    } else {
        setCartItems([]); 
    }
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTotalItems
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
