
'use client';

import React, { useState, useEffect, type PropsWithChildren } from 'react';
import { CartContext, type CartContextType } from '@/hooks/useCart';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('speedyShopCart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          // Basic validation to ensure items have critical properties
          const validItems = parsedCart.filter(item =>
            item && typeof item.id === 'string' &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number' &&
            typeof item.name === 'string' // Added name check for consistency
          );
          setCartItems(validItems);
        } else {
          console.warn("Stored cart is not an array, resetting.");
          localStorage.setItem('speedyShopCart', JSON.stringify([]));
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage, resetting.", error);
      setCartItems([]); // Reset to empty cart on error
      localStorage.setItem('speedyShopCart', JSON.stringify([]));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('speedyShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast({
      title: `${product.name} added to cart!`,
      description: `Quantity: ${quantity}`,
    });
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
    if (!itemToUpdate) return;

    if (quantity <= 0) {
      removeFromCart(productId); // This will handle toast and state update
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
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
    }
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    getTotalItems,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
