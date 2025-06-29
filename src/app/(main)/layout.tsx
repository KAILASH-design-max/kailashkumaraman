
'use client';

import { useState, useEffect } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    // This hook ensures that we're using the client's date after hydration.
    setYear(new Date().getFullYear());
  }, []);

  return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by SpeedyShop Proto Team. © {year}
            </p>
          </div>
        </footer>
      </div>
  );
}
