'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { TrainingSession, TrainingActivity } from '@/types'
import { TrainingCard } from '@/components/training/training-card'
import { CommandProgress } from '@/components/training/command-progress'

// Temporary mock data - will be replaced with real data from API
const recentSessions: TrainingSession[] = [
  {
    id: '1',
    dogId: '1',
    date: new Date().toISOString(),
    duration: 30,
    activities: [
      {
        command: 'Sit',
        successRate: 85,
        metrics: {
          withTreats: 90,
          withVerbalCommand: 85,
          withHandSignal: 80,
          withDistractions: 70
        }
      },
      {
        command: 'Stay',
        successRate: 75,
        metrics: {
          withTreats: 85,
          withVerbalCommand: 75,
          withHandSignal: 70,
          withDistractions: 60
        }
      }
    ],
    visibility: 'public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Training</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and monitor your dog's training progress
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/training/new"
            className="inline-flex items-center gap-x-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Session
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Training Progress */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Progress</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentSessions[0].activities.map((activity) => (
              <CommandProgress
                key={activity.command}
                command={activity.command}
                metrics={activity.metrics}
              />
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <TrainingCard
                key={session.id}
                session={session}
                onClick={() => {
                  // Handle click - navigate to session details
                }}
              />
            ))}
          </div>
          {recentSessions.length === 0 && (
            <p className="text-sm text-gray-500">No recent training sessions.</p>
          )}
        </div>
      </div>
    </div>
  )
}
