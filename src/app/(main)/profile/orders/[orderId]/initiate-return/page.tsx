
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Package, RotateCcw, AlertTriangle, Info, Loader2, CheckCircle, ShoppingBag } from 'lucide-react';
import type { Order as OrderType, OrderItem as OrderItemType, OrderStatus } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';

const returnReasons = [
  { value: 'damaged', label: 'Item was damaged/defective' },
  { value: 'wrong_item', label: 'Received wrong item' },
  { value: 'size_issue', label: 'Sizing issue / Does not fit' },
  { value: 'not_as_described', label: 'Not as described / Pictured differently' },
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'better_price', label: 'Found a better price elsewhere' },
  { value: 'other', label: 'Other' },
];

interface ReturnItemSelection {
  productId: string;
  name: string;
  returnQuantity: number;
  reason: string;
  orderedQuantity: number;
  price: number;
  imageUrl?: string;
}

export default function InitiateReturnPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [selectedItemsForReturn, setSelectedItemsForReturn] = useState<Record<string, ReturnItemSelection>>({});

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setPageError("Order ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setPageError(null);
      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          const fetchedOrder: OrderType = {
            id: orderSnap.id,
            userId: data.userId,
            items: data.items as OrderItemType[],
            totalAmount: data.totalAmount || data.total,
            status: data.orderStatus as OrderStatus,
            deliveryAddress: data.address,
            orderDate: (data.orderDate as Timestamp).toDate().toISOString(),
            // Add other fields as necessary from your OrderType
          };
          setOrder(fetchedOrder);
        } else {
          setPageError(`Order with ID ${orderId} not found.`);
        }
      } catch (error: any) {
        console.error("Error fetching order:", error);
        setPageError(`Failed to fetch order details: ${error.message || "Please try again."}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleItemSelectionChange = (itemId: string, checked: boolean) => {
    const itemDetails = order?.items.find(i => i.productId === itemId);
    if (!itemDetails) return;

    setSelectedItemsForReturn(prev => {
      const updated = { ...prev };
      if (checked) {
        updated[itemId] = {
          productId: itemDetails.productId,
          name: itemDetails.name,
          returnQuantity: 1, // Default to 1
          reason: '', // Default empty reason
          orderedQuantity: itemDetails.quantity,
          price: itemDetails.price,
          imageUrl: itemDetails.imageUrl,
        };
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const handleReturnDetailChange = (itemId: string, field: 'returnQuantity' | 'reason', value: string | number) => {
    setSelectedItemsForReturn(prev => {
      if (!prev[itemId]) return prev;
      const updatedItem = { ...prev[itemId], [field]: value };
      
      if (field === 'returnQuantity') {
        const numValue = Number(value);
        if (numValue < 1) updatedItem.returnQuantity = 1;
        else if (numValue > updatedItem.orderedQuantity) updatedItem.returnQuantity = updatedItem.orderedQuantity;
        else updatedItem.returnQuantity = numValue;
      }
      
      return { ...prev, [itemId]: updatedItem };
    });
  };

  const handleSubmitReturnRequest = async () => {
    if (Object.keys(selectedItemsForReturn).length === 0) {
      toast({ title: "No Items Selected", description: "Please select at least one item to return.", variant: "destructive" });
      return;
    }

    for (const item of Object.values(selectedItemsForReturn)) {
      if (!item.reason) {
        toast({ title: "Reason Missing", description: `Please select a reason for returning "${item.name}".`, variant: "destructive" });
        return;
      }
      if (item.returnQuantity <= 0 || item.returnQuantity > item.orderedQuantity) {
        toast({ title: "Invalid Quantity", description: `Please enter a valid return quantity for "${item.name}".`, variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const returnRequestData = {
        orderId: orderId,
        requestedAt: serverTimestamp(),
        status: 'Requested', // Initial status
        items: Object.values(selectedItemsForReturn).map(item => ({
          productId: item.productId,
          name: item.name,
          returnedQuantity: item.returnQuantity,
          reason: item.reason,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        userId: order?.userId
      };

      // Example: Update the order document with return request info
      // In a real app, you might create a separate 'returns' collection
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        returnRequests: arrayUnion(returnRequestData), // Store as an array of requests if multiple partial returns possible
        orderStatus: 'Return Requested' // Optionally update main order status
      });
      
      toast({
        title: "Return Request Submitted",
        description: "Your return request has been submitted successfully. We'll review it shortly.",
        variant: "default",
        duration: 5000,
      });
      router.push(`/profile/orders/${orderId}/track`); 
    } catch (error: any) {
      console.error("Error submitting return request:", error);
      toast({ title: "Submission Failed", description: `Could not submit your return request: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canInitiateReturn = useMemo(() => {
    if (!order) return false;
    // Add logic here based on order status or date if needed
    // For now, assuming returns are possible for 'Delivered' or similar statuses
    return ['Delivered', 'Shipped', 'Out for Delivery', 'Confirmed', 'Placed'].includes(order.status);
  }, [order]);


  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-2">Loading order details...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Orders
            </Link>
          </Button>
        </div>
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Order details could not be loaded.</p>
         <Button variant="outline" asChild className="mt-4">
            <Link href="/profile/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }
  
  if (!canInitiateReturn) {
    return (
      <div className="container mx-auto py-10 px-4">
         <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/profile/orders/${orderId}/track`} className="text-sm text-muted-foreground hover:text-primary flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Order Details
            </Link>
          </Button>
        </div>
        <Alert variant="default" className="max-w-lg mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Return Not Possible</AlertTitle>
          <AlertDescription>
            This order is not eligible for return at this time. Current status: {order.status}.
            Please check our return policy or contact support for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/profile/orders/${orderId}/track`} className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Order Details
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <RotateCcw className="mr-3 h-8 w-8" /> Initiate Return
        </h1>
        <p className="text-muted-foreground mt-1">Order ID: {order.id.substring(0,10)}... | Placed: {new Date(order.orderDate).toLocaleDateString()}</p>
      </header>

      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Return Process Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0"/> We'll review your return request within 24–48 hours.</p>
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0"/> If approved, refunds will be processed back to your original payment method.</p>
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0"/> Return Status will be updated as: Requested → Approved/Rejected → Refunded.</p>
            <p className="mt-2 text-xs italic">Please ensure items are in their original condition and packaging where applicable.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl">
        <CardHeader>
            <CardTitle className="text-xl">Select Items to Return</CardTitle>
            <CardDescription>Choose the products you wish to return, specify quantity and reason.</CardDescription>
        </CardHeader>
        <CardContent>
            {order.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items in this order to return.</p>
            ) : (
                <div className="space-y-6">
                    {order.items.map((item) => (
                        <Card key={item.productId} className="p-4 border rounded-lg shadow-sm bg-secondary/20">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-3 flex-grow">
                                    <Checkbox
                                        id={`item-${item.productId}`}
                                        checked={!!selectedItemsForReturn[item.productId]}
                                        onCheckedChange={(checked) => handleItemSelectionChange(item.productId, !!checked)}
                                        aria-label={`Select ${item.name} for return`}
                                        className="self-start sm:self-center mt-1 sm:mt-0"
                                    />
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover aspect-square border" data-ai-hint="return item" />
                                    ) : (
                                        <div className="w-[60px] h-[60px] bg-muted rounded-md flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <Label htmlFor={`item-${item.productId}`} className="font-medium text-base cursor-pointer hover:text-primary">{item.name}</Label>
                                        <p className="text-xs text-muted-foreground">Ordered: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                                        <p className="text-sm font-semibold text-primary">Subtotal: ₹{(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedItemsForReturn[item.productId] && (
                                <div className="mt-4 pl-2 sm:pl-10 space-y-3 border-l-2 border-primary/50 ml-2 sm:ml-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor={`quantity-${item.productId}`} className="text-xs font-medium">Quantity to Return</Label>
                                            <Input
                                                type="number"
                                                id={`quantity-${item.productId}`}
                                                value={selectedItemsForReturn[item.productId].returnQuantity}
                                                onChange={(e) => handleReturnDetailChange(item.productId, 'returnQuantity', parseInt(e.target.value, 10))}
                                                min="1"
                                                max={item.quantity}
                                                className="h-9 text-sm hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`reason-${item.productId}`} className="text-xs font-medium">Reason for Return</Label>
                                            <Select
                                                value={selectedItemsForReturn[item.productId].reason}
                                                onValueChange={(value) => handleReturnDetailChange(item.productId, 'reason', value)}
                                                required
                                            >
                                                <SelectTrigger id={`reason-${item.productId}`} className="h-9 text-sm">
                                                    <SelectValue placeholder="Select a reason" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {returnReasons.map(reason => (
                                                        <SelectItem key={reason.value} value={reason.value} className="text-sm">
                                                            {reason.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                     <Separator className="my-6" />
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmitReturnRequest} 
                            disabled={isSubmitting || Object.keys(selectedItemsForReturn).length === 0}
                            className="min-w-[200px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Submit Return Request
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

