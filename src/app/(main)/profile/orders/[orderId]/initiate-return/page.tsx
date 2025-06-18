
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Package, RotateCcw, AlertTriangle, Info, Loader2, CheckCircle, ShoppingBag, MessageSquare } from 'lucide-react';
import type { Order as OrderType, OrderItem as OrderItemType, OrderStatus } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, Timestamp, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const returnReasons = [
  { value: 'damaged', label: 'Item was damaged/defective' },
  { value: 'wrong_item', label: 'Received wrong item' },
  { value: 'size_issue', label: 'Sizing issue / Does not fit' },
  { value: 'not_as_described', label: 'Not as described / Pictured differently' },
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'better_price', label: 'Found a better price elsewhere' },
  { value: 'other', label: 'Other (specify in notes)' },
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
  const [additionalNotes, setAdditionalNotes] = useState('');

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
          returnQuantity: 1, 
          reason: '', 
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
    if (!auth.currentUser) {
        toast({ title: "Not Authenticated", description: "Please log in to submit a return request.", variant: "destructive"});
        return;
    }
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
      const newReturnRequestDoc = {
        userId: auth.currentUser.uid,
        orderId: orderId,
        items: Object.values(selectedItemsForReturn).map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.returnQuantity, 
          reason: item.reason,
          price: item.price, 
          imageUrl: item.imageUrl || '',
        })),
        additionalNotes: additionalNotes.trim() || null,
        status: 'Requested',
        requestedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "returns"), newReturnRequestDoc);
      
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        orderStatus: 'Return Requested' 
      });
      
      toast({
        title: "Return Request Submitted",
        description: `Your return request (ID: ${docRef.id.substring(0,6)}...) has been submitted successfully. We'll review it shortly.`,
        variant: "default",
        duration: 7000,
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
    if (typeof order.status === 'string') {
        return order.status.trim().toLowerCase() === 'delivered';
    }
    return false;
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
          <AlertTitle>Return Not Possible for this Order</AlertTitle>
          <AlertDescription>
            This order (status: {order.status}) is not currently eligible for return. 
            Typically, returns are accepted for 'Delivered' orders. Please check our return policy or contact support.
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

      <Card className="shadow-lg mb-8 bg-secondary/30 border-primary/20">
        <CardHeader>
            <CardTitle className="text-xl text-primary">Need to return an item?</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
            Select the product(s) you’d like to return from this order. Provide a reason, and submit your request.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0"/> We'll review your return request within 24–48 hours.</p>
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0"/> If approved, refunds will be processed back to your original payment method.</p>
            <p className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0"/> Return Status will be updated as: Requested → Approved/Rejected → Refunded.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl">
        <CardHeader>
            <CardTitle className="text-xl">Select Items & Provide Details</CardTitle>
            <CardDescription>Choose products, specify quantity, and reason for return.</CardDescription>
        </CardHeader>
        <CardContent>
            {order.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items in this order to return.</p>
            ) : (
                <div className="space-y-6">
                    {order.items.map((item) => (
                        <Card key={item.productId} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-3 flex-grow">
                                    <Checkbox
                                        id={`item-${item.productId}`}
                                        checked={!!selectedItemsForReturn[item.productId]}
                                        onCheckedChange={(checked) => handleItemSelectionChange(item.productId, !!checked)}
                                        aria-label={`Select ${item.name} for return`}
                                        className="self-start sm:self-center mt-1 sm:mt-0 h-5 w-5"
                                    />
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover aspect-square border" data-ai-hint="return item image" />
                                    ) : (
                                        <div className="w-[60px] h-[60px] bg-muted rounded-md flex items-center justify-center">
                                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <Label htmlFor={`item-${item.productId}`} className="font-medium text-base cursor-pointer hover:text-primary">{item.name}</Label>
                                        <p className="text-xs text-muted-foreground">Ordered: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                                        <p className="text-sm font-semibold text-primary">Item Subtotal: ₹{(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedItemsForReturn[item.productId] && (
                                <div className="mt-4 pl-2 sm:pl-10 space-y-3 border-l-2 border-primary/30 ml-2 sm:ml-0 pt-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`quantity-${item.productId}`} className="text-sm font-medium mb-1 block">Quantity to Return</Label>
                                            <Input
                                                type="number"
                                                id={`quantity-${item.productId}`}
                                                value={selectedItemsForReturn[item.productId].returnQuantity}
                                                onChange={(e) => handleReturnDetailChange(item.productId, 'returnQuantity', parseInt(e.target.value, 10))}
                                                min="1"
                                                max={item.quantity}
                                                className="h-10 text-base hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`reason-${item.productId}`} className="text-sm font-medium mb-1 block">Reason for Return</Label>
                                            <Select
                                                value={selectedItemsForReturn[item.productId].reason}
                                                onValueChange={(value) => handleReturnDetailChange(item.productId, 'reason', value)}
                                                required
                                            >
                                                <SelectTrigger id={`reason-${item.productId}`} className="h-10 text-base">
                                                    <SelectValue placeholder="Select a reason" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {returnReasons.map(reason => (
                                                        <SelectItem key={reason.value} value={reason.value} className="text-base">
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
                     <div>
                        <Label htmlFor="additionalNotes" className="text-lg font-medium mb-1 block flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5 text-primary" />Additional Notes (Optional)
                        </Label>
                        <Textarea
                            id="additionalNotes"
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Describe any issue in detail..."
                            rows={3}
                            className="text-base"
                        />
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="text-base py-2.5 px-6">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmitReturnRequest} 
                            disabled={isSubmitting || Object.keys(selectedItemsForReturn).length === 0}
                            className="min-w-[240px] text-base py-2.5 px-6"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="mr-2 h-5 w-5" /> Initiate Return Request
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

