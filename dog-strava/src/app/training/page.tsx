'use client'

import { ProtectedRoute } from '@/features/auth/components'
import { TrainingLog } from '@/features/training/components'

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <TrainingLog />
      </div>
    </ProtectedRoute>
  )
}
