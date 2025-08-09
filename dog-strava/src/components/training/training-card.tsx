'use client'

import { TrainingSession } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline'

interface TrainingCardProps {
  session: TrainingSession
  onClick?: () => void
}

export function TrainingCard({ session, onClick }: TrainingCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary transition-colors cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-5 w-5 text-forest" />
              <h3 className="text-lg font-semibold text-gray-900">
                Training Session
              </h3>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {session.activities.map(activity => activity.command).join(', ')}
            </div>
          </div>
          <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-primary">
            {session.visibility}
          </span>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {formatDuration(session.duration)}
          </div>
          <div>
            {formatDate(new Date(session.date))}
          </div>
        </div>
      </div>
    </div>
  )
}
