import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Password reset functionality is not yet implemented in this prototype.
      </p>
      <div className="text-center">
        <Link href="/login" className="font-medium text-primary hover:underline">
          &larr; Back to Login
        </Link>
      </div>
    </>
  );
}
