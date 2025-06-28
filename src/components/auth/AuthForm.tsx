
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type AuthError,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow sign-in button.
        },
      });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleFirebaseAuthError = (error: AuthError) => {
    console.error("Firebase Auth Error:", error.code, error.message);
    let errorMessage = "An unexpected error occurred. Please try again.";
    switch (error.code) {
      case "auth/operation-not-allowed":
        errorMessage = "Phone number sign-in is not enabled for this app. Please enable it in the Firebase console.";
        break;
      case "auth/invalid-phone-number":
        errorMessage = "The phone number you entered is not valid. Please ensure it's in E.164 format (e.g., +919876543210).";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many requests. Please try again later.";
        break;
      case "auth/code-expired":
        errorMessage = "The verification code has expired. Please request a new one.";
        break;
      case "auth/invalid-verification-code":
        errorMessage = "The OTP you entered is incorrect. Please try again.";
        break;
      default:
        errorMessage = `An error occurred: ${error.message}`;
    }
    toast({
      title: 'Authentication Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const handleUserInFirestore = async (user: FirebaseUser) => {
    if (!user.phoneNumber) return;
    const userRef = doc(db, 'users', user.uid);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            await updateDoc(userRef, { lastLogin: serverTimestamp() });
        } else {
            await setDoc(userRef, {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });
        }
    } catch (firestoreError: any) {
        console.error("Error handling user in Firestore:", firestoreError);
        toast({
            title: 'Database Error',
            description: 'Could not save your user data, but you are logged in.',
            variant: 'destructive',
        });
    }
  };

  const onPhoneNumberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setCanResend(false);

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = `+91${formattedPhone}`;
      } else {
        toast({
          title: 'Invalid Phone Number',
          description: 'Please enter a valid 10-digit phone number, with or without the +91 country code.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("reCAPTCHA verifier not initialized.");
      }
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      setTimer(60); // Reset timer
      toast({ title: 'OTP Sent', description: `An OTP has been sent to ${phone}.` });
    } catch (error) {
      handleFirebaseAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const redirectUrl = searchParams.get('redirect') || '/';

    if (!window.confirmationResult) {
      toast({ title: "Error", description: "Confirmation result not found. Please try sending the OTP again.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      console.log("OTP verification successful, user:", user);
      
      await handleUserInFirestore(user);

      toast({ title: 'Login Successful', description: 'Welcome to SpeedyShop!' });
      router.push(redirectUrl);
    } catch (error) {
      handleFirebaseAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = `+91${formattedPhone}`;
      } else {
        toast({
          title: 'Invalid Phone Number',
          description: 'Please check the phone number before resending.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const appVerifier = window.recaptchaVerifier;
       if (!appVerifier) {
        throw new Error("reCAPTCHA verifier not initialized.");
      }
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setTimer(60);
      setCanResend(false);
      toast({ title: 'OTP Resent', description: 'A new OTP has been sent.' });
    } catch (error) {
        handleFirebaseAuthError(error as AuthError);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>
      {!isOtpSent ? (
        <form onSubmit={onPhoneNumberSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
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
            Verify OTP & Log In
          </Button>
          <div className="text-center text-sm">
            {canResend ? (
                <Button variant="link" onClick={resendOtp} disabled={isLoading}>Resend OTP</Button>
            ) : (
                <p className="text-muted-foreground">Resend OTP in {timer}s</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
