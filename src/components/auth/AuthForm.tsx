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
  type AuthError 
} from 'firebase/auth';
import {
  collection,
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

    const redirectUrl = searchParams.get('redirect') || '/';

    try {
      if (mode === 'signup') {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a user document in Firestore
        await setDoc(doc(db, "customers", user.uid), {
          uid: user.uid,
          email: user.email,
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
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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
          placeholder="••••••••"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'login' ? 'Log In' : 'Create Account'}
      </Button>
    </form>
  );
}
