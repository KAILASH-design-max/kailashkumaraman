
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Create your Account</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Join SpeedyShop Proto for lightning-fast deliveries.
      </p>
      <AuthForm mode="signup" />
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
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
