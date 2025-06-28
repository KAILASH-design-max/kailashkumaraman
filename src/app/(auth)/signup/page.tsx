
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">One-Step Sign-In</h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        We've simplified our process! Your account is created automatically when you log in for the first time with your phone number.
      </p>
      <div className="text-center">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Proceed to Login &rarr;
        </Link>
      </div>
    </>
  );
}
