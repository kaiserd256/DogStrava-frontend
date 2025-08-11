'use client';

import { useAuthStore } from '@/stores';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAppStore } from '@/stores';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// Loading skeleton component for smooth transitions
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen } = useAppStore();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Auth pages should not show the main layout
  const isAuthPage = pathname?.startsWith('/auth');

  // Handle smooth loading transitions
  useEffect(() => {
    // Show loading skeleton briefly for smooth transitions
    setIsLoading(true);
    setShowContent(false);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 150); // Brief delay for smooth transition

    return () => clearTimeout(timer);
  }, [pathname]);

  // If user is not authenticated, only show auth pages without layout
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className={`transition-opacity duration-200 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </div>
    );
  }

  // For authenticated users or non-auth pages, show the full layout
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
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className={`transition-opacity duration-200 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
