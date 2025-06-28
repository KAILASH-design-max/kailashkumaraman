'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  type AuthError 
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFirebaseAuthError = (error: AuthError) => {
    console.error("Firebase Auth Error:", error.code, error.message);
    let errorMessage = "An unexpected error occurred. Please try again.";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "The email address is not valid. Please check and try again.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage = "Invalid email or password. Please try again.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "An account with this email address already exists. Please log in.";
        break;
      case "auth/weak-password":
        errorMessage = "The password is too weak. It must be at least 6 characters long.";
        break;
      default:
        errorMessage = `An error occurred: ${error.message}`;
    }
    setError(errorMessage);
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const redirectUrl = searchParams.get('redirect') || '/';

    try {
      if (mode === 'signup') {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user's profile with display name
        await updateProfile(user, { displayName: name });

        // Create a user document in Firestore
        await setDoc(doc(db, "customers", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          phoneNumber: phoneNumber,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        toast({ title: 'Account Created', description: 'Welcome to SpeedyShop!' });
        router.push(redirectUrl);

      } else {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push(redirectUrl);
      }
      
      // Force a reload to ensure navbar state updates across the app
      setTimeout(() => window.location.reload(), 200);

    } catch (authError) {
      handleFirebaseAuthError(authError as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {mode === 'signup' && (
        <>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </>
      )}
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? "Create a secure password" : "••••••••"}
          required
        />
      </div>
      {mode === 'signup' && (
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password to confirm"
            required
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'login' ? 'Log In' : 'Create Account'}
      </Button>
    </form>
  );
}
