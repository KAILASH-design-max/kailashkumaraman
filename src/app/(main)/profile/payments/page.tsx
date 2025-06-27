
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, CreditCard, Edit3, Trash2, PlusCircle, CheckCircle, Loader2, AlertTriangle, Wallet, AtSign } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { PaymentMethod } from '@/lib/types';
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
  Timestamp,
  getDocs,
  limit,
  orderBy
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaymentsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'card', label: '', details: '' });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
        setPaymentMethods([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const methodsRef = collection(db, 'paymentMethods');
      const q = query(methodsRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
      
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const fetchedMethods: PaymentMethod[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMethods.push({
            id: doc.id,
            userId: data.userId,
            type: data.type,
            label: data.label,
            details: data.details,
            isDefault: data.isDefault,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
          } as PaymentMethod);
        });
        setPaymentMethods(fetchedMethods);
        setIsLoading(false);
      }, (err) => {
        console.error("Firestore onSnapshot error: ", err);
        setError("Failed to fetch payment methods. Please check your connection and Firestore security rules.");
        setIsLoading(false);
      });
      
      return () => unsubscribeFirestore();
    } else {
        setIsLoading(false);
        setPaymentMethods([]);
    }
  }, [currentUser]);

  const handleSetDefault = async (methodIdToSet: string) => {
    if (!currentUser) return;
    
    const methodsRef = collection(db, 'paymentMethods');
    const q = query(methodsRef, where('userId', '==', currentUser.uid), where('isDefault', '==', true));
    
    try {
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);

        querySnapshot.forEach(docSnap => {
            if (docSnap.id !== methodIdToSet) {
                batch.update(docSnap.ref, { isDefault: false });
            }
        });

        const newDefaultRef = doc(db, 'paymentMethods', methodIdToSet);
        batch.update(newDefaultRef, { isDefault: true, updatedAt: serverTimestamp() });
        
        await batch.commit();
        toast({ title: "Success", description: "Default payment method updated." });
    } catch (e) {
        console.error("Error setting default payment method: ", e);
        toast({ title: "Error", description: "Could not set default method.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'paymentMethods', id));
        toast({ title: "Payment Method Deleted", description: "The payment method has been removed.", variant: "destructive" });
    } catch (e) {
        console.error("Error deleting payment method: ", e);
        toast({ title: "Error", description: "Could not delete payment method.", variant: "destructive" });
    }
  };
  
  const handleAddNewPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPayment.label || !newPayment.details) {
        toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    try {
        const methodsRef = collection(db, 'paymentMethods');
        const q = query(methodsRef, where('userId', '==', currentUser.uid), limit(1));
        const snapshot = await getDocs(q);
        const isFirstMethod = snapshot.empty;
        
        let detailsObject = {};
        switch (newPayment.type) {
            case 'card':
                detailsObject = { cardNumberMasked: `**** **** **** ${newPayment.details.slice(-4)}` };
                break;
            case 'upi':
                detailsObject = { upiId: newPayment.details };
                break;
            case 'wallet':
                detailsObject = { balance: 0 }; // Wallets start with 0 balance
                break;
        }

        await addDoc(collection(db, 'paymentMethods'), {
            userId: currentUser.uid,
            type: newPayment.type,
            label: newPayment.label,
            details: detailsObject,
            isDefault: isFirstMethod,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        toast({ title: "Success", description: "New payment method added." });
        setNewPayment({ type: 'card', label: '', details: '' });
        setShowAddForm(false);
    } catch (e) {
      console.error("Error adding new payment method: ", e);
      toast({ title: "Error", description: "Could not add payment method.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
        case 'card': return <CreditCard className="h-5 w-5 text-accent"/>;
        case 'upi': return <AtSign className="h-5 w-5 text-accent"/>;
        case 'wallet': return <Wallet className="h-5 w-5 text-accent"/>;
        default: return <CreditCard className="h-5 w-5 text-accent"/>;
    }
  };

  const getDetailsString = (pm: PaymentMethod) => {
    switch (pm.type) {
      case 'card': return pm.details.cardNumberMasked || 'N/A';
      case 'upi': return pm.details.upiId || 'N/A';
      case 'wallet': return `Balance: ₹${pm.details.balance?.toFixed(2) ?? '0.00'}`;
      default: return 'N/A';
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="mt-2">Loading your payment methods...</p></div>;
    }
    if (error) {
        return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }
    if (!currentUser) {
        return <Alert><AlertTitle>Please Log In</AlertTitle><AlertDescription>You need to be logged in to manage your payment methods. <Link href="/login?redirect=/profile/payments" className="text-primary font-semibold hover:underline">Log in now</Link>.</AlertDescription></Alert>
    }
    if (paymentMethods.length === 0 && !showAddForm) {
      return <p className="text-center text-muted-foreground p-4 border border-dashed rounded-md">You have no saved payment methods. Add one for faster checkout!</p>;
    }
    return paymentMethods.map((pm) => (
      <Card key={pm.id} className={`shadow-md ${pm.isDefault ? 'border-2 border-primary' : ''}`}>
        <CardHeader>
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                  {getIconForType(pm.type)}
                  <div>
                      <CardTitle className="text-lg">{pm.label} {pm.isDefault && <span className="text-xs text-primary ml-2">(Default)</span>}</CardTitle>
                      <CardDescription className="text-sm">{getDetailsString(pm)}</CardDescription>
                  </div>
              </div>
              <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toast({ title: "Info", description: "Edit functionality is not yet implemented." })}>
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
              <li><strong>Secure Storage:</strong> Your payment information is stored securely.</li>
              <li><strong>Default Method:</strong> Your default method is used for quick checkouts.</li>
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
          <CreditCard className="mr-3 h-8 w-8" /> Payment Methods
        </h1>
        <p className="text-muted-foreground mt-1">
          Securely manage your saved cards, UPI IDs, and digital wallets.
        </p>
      </header>

      {currentUser && (
        <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-6">
          <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel' : 'Add New Payment Method'}
        </Button>
      )}

      {showAddForm && (
        <Card className="mb-8 shadow-lg">
          <CardHeader><CardTitle>Add New Payment Method</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddNewPayment} className="space-y-4">
               <div>
                  <Label htmlFor="pmType">Payment Type</Label>
                  <Select value={newPayment.type} onValueChange={(value) => setNewPayment({...newPayment, type: value, details: ''})}>
                    <SelectTrigger id="pmType"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI ID</SelectItem>
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div>
                  <Label htmlFor="pmLabel">Label</Label>
                  <Input id="pmLabel" type="text" placeholder="e.g., ICICI Visa, GPay" value={newPayment.label} onChange={e => setNewPayment({...newPayment, label: e.target.value})} required />
               </div>
                <div>
                  <Label htmlFor="pmDetails">Details</Label>
                  <Input 
                    id="pmDetails"
                    type={newPayment.type === 'card' ? 'number' : 'text'}
                    placeholder={
                        newPayment.type === 'card' ? "Card Number (last 4 digits stored)" :
                        newPayment.type === 'upi' ? "UPI ID (e.g. user@okbank)" :
                        "Wallet Identifier (e.g. PayPal email - simulated)"
                    } 
                    value={newPayment.details} 
                    onChange={e => setNewPayment({...newPayment, details: e.target.value})} 
                    required 
                  />
                </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Save New Method
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Saved Payment Methods</h2>
        {renderContent()}
      </div>
    </div>
  );
}
