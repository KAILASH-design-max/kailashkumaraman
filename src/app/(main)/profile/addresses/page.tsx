
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, MapPin, Edit3, Trash2, PlusCircle, CheckCircle, Phone, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp,
  getDocs,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Address {
  id: string; // Firestore document ID
  userId: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export default function AddressesPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', postalCode: '', country: 'India', phoneNumber: '' });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
        setAddresses([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
      
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const fetchedAddresses: Address[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAddresses.push({ id: doc.id, ...doc.data() } as Address);
        });
        setAddresses(fetchedAddresses);
        setIsLoading(false);
      }, (err) => {
        console.error("Firestore onSnapshot error: ", err);
        setError("Failed to fetch addresses. Please check your connection and Firestore security rules.");
        setIsLoading(false);
      });
      
      return () => unsubscribeFirestore();
    } else {
        setIsLoading(false);
        setAddresses([]);
    }
  }, [currentUser]);

  const handleSetDefault = async (addressIdToSet: string) => {
    if (!currentUser) return;
    
    const addressesRef = collection(db, 'addresses');
    const q = query(addressesRef, where('userId', '==', currentUser.uid), where('isDefault', '==', true));
    
    try {
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);

        querySnapshot.forEach(docSnap => {
            if (docSnap.id !== addressIdToSet) {
                batch.update(docSnap.ref, { isDefault: false });
            }
        });

        const newDefaultRef = doc(db, 'addresses', addressIdToSet);
        batch.update(newDefaultRef, { isDefault: true, updatedAt: serverTimestamp() });
        
        await batch.commit();
        toast({ title: "Success", description: "Default address updated." });
    } catch (e) {
        console.error("Error setting default address: ", e);
        toast({ title: "Error", description: "Could not set default address.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'addresses', id));
        toast({ title: "Address Deleted", description: "The address has been removed.", variant: "destructive" });
    } catch (e) {
        console.error("Error deleting address: ", e);
        toast({ title: "Error", description: "Could not delete address.", variant: "destructive" });
    }
  };
  
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Not Authenticated", description: "You must be logged in to add an address.", variant: "destructive" });
      return;
    }
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.postalCode || !newAddress.phoneNumber) {
        toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', currentUser.uid), limit(1));
      const snapshot = await getDocs(q);
      const isFirstAddress = snapshot.empty;

      await addDoc(collection(db, 'addresses'), {
        ...newAddress,
        userId: currentUser.uid,
        isDefault: isFirstAddress,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast({ title: "Success", description: "New address added successfully." });
      setNewAddress({ name: '', street: '', city: '', postalCode: '', country: 'India', phoneNumber: '' });
      setShowAddForm(false);
    } catch (e) {
      console.error("Error adding new address: ", e);
      toast({ title: "Error", description: "Could not add new address.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="mt-2">Loading addresses...</p></div>;
    }
    if (error) {
        return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }
    if (!currentUser) {
        return <Alert><AlertTitle>Please Log In</AlertTitle><AlertDescription>You need to be logged in to manage your addresses. <Link href="/login?redirect=/profile/addresses" className="text-primary font-semibold hover:underline">Log in now</Link>.</AlertDescription></Alert>
    }
    if (addresses.length === 0 && !showAddForm) {
      return <p className="text-center text-muted-foreground p-4 border border-dashed rounded-md">You have no saved addresses. Add one to get started!</p>;
    }
    return addresses.map((address) => (
      <Card key={address.id} className={`shadow-md ${address.isDefault ? 'border-2 border-primary' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{address.name} {address.isDefault && <span className="text-xs text-primary ml-2">(Default)</span>}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => toast({ title: "Info", description: "Edit functionality is not yet implemented." })}>
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
          <p className="text-sm flex items-center"><Phone className="mr-1.5 h-3.5 w-3.5 text-muted-foreground"/>{address.phoneNumber}</p>
          {!address.isDefault && (
            <Button variant="link" size="sm" onClick={() => handleSetDefault(address.id)} className="p-0 h-auto mt-2 text-primary">
              <CheckCircle className="mr-1 h-3 w-3"/> Set as Default
            </Button>
          )}
          <Separator className="my-3"/>
          <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              <li><strong>Default Address:</strong> Used for faster checkouts. Only one can be default.</li>
              <li><strong>Manage Addresses:</strong> Add, edit, or remove addresses at any time.</li>
          </ul>
        </CardContent>
      </Card>
    ));
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
          <MapPin className="mr-3 h-8 w-8" /> Address Book
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your saved shipping addresses for faster checkout.
        </p>
      </header>

      {currentUser && (
        <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-6">
            <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel Adding' : 'Add New Address'}
        </Button>
      )}

      {showAddForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewAddress} className="space-y-4">
              <div>
                <Label htmlFor="addrName">Address Nickname</Label>
                <Input id="addrName" type="text" placeholder="e.g., Home, Office" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="addrStreet">Street Address</Label>
                <Input id="addrStreet" type="text" placeholder="Street Address, Apt, Suite" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addrCity">City</Label>
                  <Input id="addrCity" type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="addrPostalCode">Postal Code</Label>
                  <Input id="addrPostalCode" type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} required />
                </div>
              </div>
              <div>
                <Label htmlFor="addrCountry">Country</Label>
                <Input id="addrCountry" type="text" placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="addrPhoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="addrPhoneNumber" type="tel" placeholder="Phone Number" value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Save New Address
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Saved Addresses</h2>
        {renderContent()}
      </div>
    </div>
  );
}
