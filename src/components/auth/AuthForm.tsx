'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SIMULATED_OTP = '123456';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInFirestore = async (phoneNumber: string) => {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phoneNumber', '==', phoneNumber));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // New user
        const newCustomerDoc = await addDoc(customersRef, {
          phoneNumber: phoneNumber,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isVerified: false,
        });
        return { uid: newCustomerDoc.id, phoneNumber };
      } else {
        // Existing user
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'customers', userDoc.id), {
          lastLogin: serverTimestamp(),
        });
        return { uid: userDoc.id, phoneNumber };
      }
    } catch (firestoreError: any) {
      console.error("Error handling user in Firestore:", firestoreError);
      toast({
        title: 'Database Error',
        description: 'Could not save your user data, but you are logged in for this session.',
        variant: 'destructive',
      });
      // Allow login even if firestore fails, but return a temporary object
      return { uid: `temp_${Date.now()}`, phoneNumber };
    }
  };

  const onPhoneNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phone.trim().length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      toast({ title: 'OTP Sent (Simulated)', description: `Enter ${SIMULATED_OTP} to continue.` });
    }, 500);
  };

  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const redirectUrl = searchParams.get('redirect') || '/';

    if (otp !== SIMULATED_OTP) {
      toast({
        title: 'Incorrect OTP',
        description: `Please enter the correct simulated OTP: ${SIMULATED_OTP}`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // "Verification" successful
    const userSessionData = await handleUserInFirestore(phone);

    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify(userSessionData));
    }
    
    toast({ title: 'Login Successful', description: 'Welcome to SpeedyShop! (Simulated)' });
    router.push(redirectUrl);
    // Force a reload to ensure navbar state updates
    setTimeout(() => window.location.reload(), 200);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Developer Notice</AlertTitle>
            <AlertDescription>
                This is a temporary login simulation for testing only. Use OTP <strong>123456</strong> to proceed.
            </AlertDescription>
        </Alert>
      {!isOtpSent ? (
        <form onSubmit={onPhoneNumberSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={onOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Log In
          </Button>
        </form>
      )}
    </div>
  );
}
