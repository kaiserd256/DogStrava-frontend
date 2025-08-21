'use client';

import { Home, Activity, Users, PlusCircle, Settings, Dog } from 'lucide-react';
import { useAppStore } from '@/stores';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Activity, label: 'Activity Feed', href: '/activity' },
  { icon: Dog, label: 'My Dogs', href: '/dogs' },
  { icon: PlusCircle, label: 'Training', href: '/training' },
  { icon: Users, label: 'Following', href: '/following' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const { sidebarOpen } = useAppStore();
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href} prefetch={true}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  !sidebarOpen && 'px-3'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
