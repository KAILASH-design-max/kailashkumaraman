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
      <span className={`font-headline font-bold ${textSize} text-primary`}>
        SpeedyShop
      </span>
    </Link>
  );
}
