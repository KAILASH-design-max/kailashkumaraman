import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-1">Welcome Back!</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your email and password to access your account.
      </p>
      <AuthForm mode="login" />
      <div className="mt-4 text-center text-xs text-muted-foreground flex justify-between">
        <Link href="/forgot-password" className="underline hover:text-primary">
          Forgot Password?
        </Link>
        <Link href="/signup" className="underline hover:text-primary">
          Don't have an account? Sign up
        </Link>
      </div>
    </>
  );
}
