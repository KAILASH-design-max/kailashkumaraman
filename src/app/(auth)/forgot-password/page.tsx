
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, type AuthError } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleFirebaseAuthError = (error: AuthError) => {
    console.error("Firebase Password Reset Error:", error.code, error.message);
    let errorMessage = "An unexpected error occurred. Please try again.";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "The email address is not valid. Please check and try again.";
        break;
      case "auth/user-not-found":
        errorMessage = "No account was found with this email address.";
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
    setIsEmailSent(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast({
        title: 'Email Sent!',
        description: 'A password reset link has been sent to your email address.',
      });
    } catch (authError) {
      handleFirebaseAuthError(authError as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Check Your Email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
        </p>
        <div className="text-center">
            <Link href="/login" className="font-medium text-primary hover:underline">
            &larr; Back to Login
            </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-2">Forgot Your Password?</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        No problem. Enter your email address below and we'll send you a link to reset it.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Request Failed</AlertTitle>
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
            placeholder="Enter your registered email"
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>
       <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline hover:text-primary">
          Remembered your password? Login
        </Link>
      </div>
    </>
  );
}
