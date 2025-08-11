'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  description?: string;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex space-x-6', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
