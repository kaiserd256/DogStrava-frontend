'use client';

import { ProtectedRoute } from '@/features/auth/components';
import { ActivityFeed } from '@/features/social/components';

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
          <p className="text-muted-foreground">
            See what dogs in your network have been up to
          </p>
        </div>
        
        <ActivityFeed />
      </div>
    </ProtectedRoute>
  );
}
