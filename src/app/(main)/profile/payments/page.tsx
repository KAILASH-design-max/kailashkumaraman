
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, CreditCard, Edit3, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  displayName: string; 
  details: string; // e.g., '**** **** **** 1234' or 'user@example' or 'PayPal'
  isDefault?: boolean;
}

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm1', type: 'card', displayName: 'Visa Debit Card', details: '**** **** **** 1234', isDefault: true },
    { id: 'pm2', type: 'upi', displayName: 'Google Pay UPI', details: 'user@okhdfcbank' },
    { id: 'pm3', type: 'wallet', displayName: 'SpeedyShop Wallet', details: 'Balance: ₹500.00' },
  ]);
   const [showAddForm, setShowAddForm] = useState(false);
   // Simplified form state
   const [newPayment, setNewPayment] = useState({ type: 'card', displayName: '', details: '' });


  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
    // API call to set default payment method
  };

  const handleDelete = (id:string) => {
     setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    // API call to delete payment method
  };
  
  const handleAddNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.displayName || !newPayment.details) {
        alert("Please fill all fields for the new payment method.");
        return;
    }
    const newPay: PaymentMethod = { ...newPayment, id: `pm${Date.now()}`, type: newPayment.type as 'card'|'upi'|'wallet' };
    setPaymentMethods(prev => [...prev, newPay]);
    setNewPayment({ type: 'card', displayName: '', details: '' });
    setShowAddForm(false);
    // API call to add payment method
  };


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
          <CreditCard className="mr-3 h-8 w-8" /> Payment Methods
        </h1>
        <p className="text-muted-foreground mt-1">
          Securely manage your saved cards, UPI IDs, and digital wallets.
        </p>
      </header>

      <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-6">
        <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel Adding' : 'Add New Payment Method'}
      </Button>

      {showAddForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader><CardTitle>Add New Payment Method</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewPayment} className="space-y-4">
              <select value={newPayment.type} onChange={e => setNewPayment({...newPayment, type: e.target.value})} className="input border p-2 rounded-md w-full text-sm">
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI ID</option>
                <option value="wallet">Digital Wallet (e.g. PayPal - simulated)</option>
              </select>
              <input type="text" placeholder="Nickname (e.g., ICICI Visa, Paytm UPI)" value={newPayment.displayName} onChange={e => setNewPayment({...newPayment, displayName: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <input type="text" placeholder={newPayment.type === 'card' ? "Card Number (mock entry)" : newPayment.type === 'upi' ? "UPI ID (e.g. user@okbank)" : "Wallet Identifier (e.g. email)"} value={newPayment.details} onChange={e => setNewPayment({...newPayment, details: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <Button type="submit">Save New Payment</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Saved Payment Methods</h2>
        {paymentMethods.length === 0 && !showAddForm ? (
          <p>You have no saved payment methods. Add one for faster checkout!</p>
        ) : (
          paymentMethods.map((pm) => (
            <Card key={pm.id} className={`shadow-md ${pm.isDefault ? 'border-2 border-primary' : ''}`}>
              <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg">{pm.displayName} {pm.isDefault && <span className="text-xs text-primary ml-2">(Default)</span>}</CardTitle>
                        <CardDescription className="text-sm">{pm.type.toUpperCase()}: {pm.details}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => alert('Edit functionality to be implemented for ID: ' + pm.id)}>
                            <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pm.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                 {!pm.isDefault && (
                  <Button variant="link" size="sm" onClick={() => handleSetDefault(pm.id)} className="p-0 h-auto text-primary">
                    <CheckCircle className="mr-1 h-3 w-3"/> Set as Default
                  </Button>
                )}
                <Separator className="my-3"/>
                 <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                    <li><strong>Store Multiple Cards:</strong> Securely save credit/debit card information.</li>
                    <li><strong>Add Digital Wallets:</strong> Link digital payment methods like UPI or other wallets (e.g., PayPal - simulated for this demo).</li>
                    <li><strong>Set Default Payment:</strong> Choose your preferred method for quick and easy checkouts.</li>
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
