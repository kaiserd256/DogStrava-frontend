'use client'

import { ProtectedRoute } from '@/features/auth/components'
import { PostCreation } from '@/features/social/components'

export default function NewTrainingPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Log Training Session</h1>
          <p className="text-muted-foreground">
            Share your dog's latest training session or achievement
          </p>
        </div>
        
        <PostCreation />
      </div>
    </ProtectedRoute>
  )
}
