'use client';

import { Menu, Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, useAuthStore } from '@/stores';
import { APP_NAME } from '@/lib/constants';

export function Header() {
  const { toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🐕</span>
          </div>
          <h1 className="text-xl font-bold text-primary">{APP_NAME}</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search dogs, activities, users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{user?.username}</span>
        </div>

        <Button variant="ghost" onClick={logout} className="text-sm">
          Logout
        </Button>
      </div>
    </header>
  );
}
