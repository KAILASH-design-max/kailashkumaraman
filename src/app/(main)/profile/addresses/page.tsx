
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Edit3, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'addr1', name: 'Home', street: '123 Main St, Apt 4B', city: 'Mumbai', postalCode: '400001', country: 'India', isDefault: true },
    { id: 'addr2', name: 'Work', street: '789 Business Park, Suite 200', city: 'Delhi', postalCode: '110001', country: 'India' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  // Basic form state for new address, can be expanded with react-hook-form
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', postalCode: '', country: 'India' });

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    // API call to set default address would go here
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    // API call to delete address would go here
  };
  
  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
        alert("Please fill all required fields.");
        return;
    }
    const newAddr: Address = { ...newAddress, id: `addr${Date.now()}`};
    setAddresses(prev => [...prev, newAddr]);
    setNewAddress({ name: '', street: '', city: '', postalCode: '', country: 'India' });
    setShowAddForm(false);
    // API call to add new address would go here
  }

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
          <MapPin className="mr-3 h-8 w-8" /> Address Book
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your saved shipping addresses for faster checkout.
        </p>
      </header>

      <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-6">
        <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel Adding' : 'Add New Address'}
      </Button>

      {showAddForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewAddress} className="space-y-4">
              <input type="text" placeholder="Address Nickname (e.g., Home, Office)" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <input type="text" placeholder="Street Address, Apt, Suite" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <input type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <input type="text" placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} className="input border p-2 rounded-md w-full text-sm" required />
              <Button type="submit">Save New Address</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Saved Addresses</h2>
        {addresses.length === 0 && !showAddForm ? (
          <p>You have no saved addresses. Add one to get started!</p>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className={`shadow-md ${address.isDefault ? 'border-2 border-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{address.name} {address.isDefault && <span className="text-xs text-primary ml-2">(Default)</span>}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => alert('Edit functionality to be implemented for ID: ' + address.id)}>
                      <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{address.street}</p>
                <p className="text-sm">{address.city}, {address.postalCode}, {address.country}</p>
                {!address.isDefault && (
                  <Button variant="link" size="sm" onClick={() => handleSetDefault(address.id)} className="p-0 h-auto mt-2 text-primary">
                    <CheckCircle className="mr-1 h-3 w-3"/> Set as Default
                  </Button>
                )}
                <Separator className="my-3"/>
                <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                    <li><strong>Edit/Delete Addresses:</strong> Modify details or remove saved addresses.</li>
                    <li><strong>Set Default Address:</strong> Choose a primary address for quicker checkouts.</li>
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
