
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Log in with your Phone</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your phone number to receive a one-time password (OTP) for secure access.
      </p>
      <AuthForm mode="login" />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Having trouble?{' '}
        <Link href="/support" className="underline hover:text-primary">
          Contact Support
        </Link>
      </p>
    </>
  );
}
