import Link from 'next/link';
import type React from 'react';

interface LogoProps {
  className?: string;
  icon?: React.ElementType;
  iconSize?: number; 
  textSize?: string;
  href?: string;
}

export function Logo({ className, icon: IconComponent, iconSize = 24, textSize = 'text-2xl', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      {IconComponent && <IconComponent size={iconSize} className="text-primary" />}
      <span className={`font-headline font-bold ${textSize} text-primary`}>
        SpeedyShop
      </span>
    </Link>
  );
}
