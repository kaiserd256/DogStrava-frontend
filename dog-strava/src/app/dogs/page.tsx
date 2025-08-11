'use client'

import { ProtectedRoute } from '@/features/auth/components'
import { DogProfile } from '@/features/dogs/components'

export default function DogsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dogs</h1>
          <p className="text-muted-foreground">
            Manage your dogs' profiles and track their training progress
          </p>
        </div>
        
        <DogProfile />
      </div>
    </ProtectedRoute>
  )
}
