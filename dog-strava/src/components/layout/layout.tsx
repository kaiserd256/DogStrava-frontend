'use client';

import { useAuthStore } from '@/stores';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAppStore } from '@/stores';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
