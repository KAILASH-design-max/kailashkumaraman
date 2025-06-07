import Link from 'next/link';
import { ShoppingCart } from 'lucide-react'; // Using ShoppingCart as a generic store icon

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  href?: string;
}

export function Logo({ className, iconSize = 32, textSize = 'text-2xl', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <ShoppingCart color="hsl(var(--primary))" size={iconSize} />
      <span className={`font-headline font-bold ${textSize} text-primary`}>
        SpeedyShop
      </span>
    </Link>
  );
}
