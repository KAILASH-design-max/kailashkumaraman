
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Secure Account Access</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Please enter your email and password to log in to your account.
      </p>
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Having trouble?{' '}
        <Link href="/support" className="underline hover:text-primary">
          Contact Support
        </Link>
      </p>
    </>
  );
}
