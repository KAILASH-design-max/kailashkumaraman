import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Create an Account</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Sign up to start shopping with SpeedyShop.
      </p>
      <AuthForm mode="signup" />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline hover:text-primary">
          Log In
        </Link>
      </p>
    </>
  );
}
