'use client'

import { PlusIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Track your dog's progress and share their achievements.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/training/new"
            className="inline-flex items-center gap-x-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Training Session
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden rounded-xl shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PuzzlePieceIcon className="h-6 w-6 text-forest" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Training Goals
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/training"
                className="font-medium text-primary hover:text-primary-dark"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Add more stat cards as needed */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          {/* Add activity list here */}
          <div className="mt-4 text-sm text-gray-500">
            No recent activity to show.
          </div>
        </div>
      </div>
    </div>
  )
}
