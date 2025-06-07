import { Logo } from '@/components/shared/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo href="/" iconSize={40} textSize="text-3xl" />
        </div>
        <div className="bg-background p-6 sm:p-8 rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
