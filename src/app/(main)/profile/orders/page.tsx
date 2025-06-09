
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ListOrdered, Filter, Repeat, RotateCcw, PackageSearch } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', total: 75.99, status: 'Delivered', items: ['Apples', 'Milk'] },
    { id: 'ORD002', date: '2023-10-28', total: 32.50, status: 'Shipped', items: ['Bread', 'Eggs'] },
    { id: 'ORD003', date: '2023-11-01', total: 120.00, status: 'Processing', items: ['Chicken', 'Rice', 'Vegetables'] },
  ];

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile Dashboard
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <ListOrdered className="mr-3 h-8 w-8" /> Order Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View your complete order history, track statuses, and manage your purchases.
        </p>
      </header>

      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Filter & Search Orders</CardTitle>
          <CardDescription>
            Quickly find specific orders by status, date, or items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            {/* Placeholder for filter controls */}
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter by Status</Button>
            <input type="date" className="input border p-2 rounded-md text-sm" placeholder="Filter by date"/>
          </div>
          <p className="text-sm text-muted-foreground">
            Feature to be implemented: Filtering options for order status (Processing, Shipped, Delivered, Returned), date range, and searching by item name or order ID.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Orders</h2>
        {mockOrders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          mockOrders.map((order) => (
            <Card key={order.id} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order ID: {order.id}</CardTitle>
                    <CardDescription>Date: {order.date} | Total: ₹{order.total.toFixed(2)}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Items: {order.items.join(', ')}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <PackageSearch className="mr-2 h-4 w-4" /> Track Status
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Repeat className="mr-2 h-4 w-4" /> Reorder
                  </Button>
                  {order.status === 'Delivered' && (
                    <Button variant="destructive" size="sm" className="flex-1">
                      <RotateCcw className="mr-2 h-4 w-4" /> Initiate Return
                    </Button>
                  )}
                </div>
                <ul className="text-xs text-muted-foreground mt-3 space-y-1 pl-4 list-disc">
                  <li><strong>Track Status:</strong> Real-time updates on order processing, shipment, and delivery.</li>
                  <li><strong>One-Click Reorder:</strong> Quickly add all items from a past order to your cart.</li>
                  <li><strong>Initiate Returns:</strong> Start a return process for eligible items from delivered orders.</li>
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
