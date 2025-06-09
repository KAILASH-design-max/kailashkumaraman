
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Create Your SpeedyShop Account</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your email, create a password, and provide basic details to get started. You may be asked to verify your phone number with an OTP for enhanced security.
      </p>
      <AuthForm mode="signup" />
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Need help?{' '}
        <Link href="/support" className="underline hover:text-primary">
          Contact Support
        </Link>
      </p>
    </>
  );
}
