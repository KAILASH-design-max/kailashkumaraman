'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MinusCircle, PlusCircle, Trash2, ShoppingBag } from 'lucide-react';

const DELIVERY_CHARGE_THRESHOLD = 299;
const DELIVERY_CHARGE_AMOUNT = 50;
const GST_RATE = 0.18;
const HANDLING_CHARGE = 5;

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal < DELIVERY_CHARGE_THRESHOLD && subtotal > 0 ? DELIVERY_CHARGE_AMOUNT : 0;
  const gstAmount = subtotal * GST_RATE;
  const totalAmount = subtotal + deliveryCharge + gstAmount + HANDLING_CHARGE;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                  data-ai-hint={item.dataAiHint || 'product item'}
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/products/${item.slug}`} passHref>
                  <h2 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    if (!isNaN(newQuantity) && newQuantity >= 1) {
                      updateQuantity(item.id, newQuantity);
                    } else if (e.target.value === '') {
                       // Allow clearing, will default to 1 or handle by updateQuantity
                    }
                  }}
                  onBlur={(e) => { // Handle empty input on blur
                    if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                        updateQuantity(item.id, 1);
                    }
                  }}
                  className="w-16 h-10 text-center hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <p className="font-semibold text-lg sm:w-24 text-center sm:text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="text-destructive hover:text-destructive/80"
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
           <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24"> {/* Sticky for summary */}
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (18%)</span>
                <span>${gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Handling Charge</span>
                <span>${HANDLING_CHARGE.toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
