
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderSummaryPage() {
  const subtotal = 250.00;
  const gstRate = 0.18;
  const handlingCharge = 5.00;
  const deliveryFee = 30.00;
  const promoCode = 'SAVE31';
  const discountAmount = 10.00;

  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount + handlingCharge + deliveryFee - discountAmount;

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Handling Charge</span>
              <span>₹{handlingCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600 font-medium">
              <span className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Promo Applied ({promoCode})
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold text-foreground">
            <span>Total Payable</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-green-50/50 p-6 rounded-b-lg">
          <div className="flex items-center justify-center text-green-700 font-semibold text-lg">
            <CheckCircle className="mr-2 h-6 w-6" />
            You Saved ₹{discountAmount.toFixed(2)} on this order!
          </div>
          <Button asChild className="w-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
