import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number; // This prop might become unused or repurposed
  textSize?: string;
  href?: string;
}

export function Logo({ className, textSize = 'text-2xl', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center ${className}`}>
      {/* Replacing ShoppingCart icon with styled text for "blinkit" */}
      <span className={`font-headline font-bold ${textSize}`}>
        <span style={{ color: '#FDB929' }}>blink</span><span style={{ color: '#84C225' }}>it</span>
      </span>
    </Link>
  );
}
