'use client'

import { useState } from 'react'
import { StatCard } from '@/components/progress/stat-card'
import { ProgressChart } from '@/components/progress/progress-chart'

// Temporary mock data - will be replaced with API data
const mockProgressData = {
  dates: [
    '2025-08-01',
    '2025-08-02',
    '2025-08-03',
    '2025-08-04',
    '2025-08-05',
  ],
  commands: {
    'Sit': {
      metrics: {
        withTreats: [90, 92, 95, 93, 96],
        withVerbalCommand: [85, 87, 88, 90, 92],
        withHandSignal: [80, 82, 85, 87, 88],
        withDistractions: [70, 72, 75, 78, 80],
      },
    },
    'Stay': {
      metrics: {
        withTreats: [85, 87, 86, 88, 90],
        withVerbalCommand: [80, 82, 83, 85, 87],
        withHandSignal: [75, 77, 78, 80, 82],
        withDistractions: [65, 68, 70, 72, 75],
      },
    },
  },
}

export default function ProgressPage() {
  const [selectedDog, setSelectedDog] = useState<string>('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Training Progress</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your dog's training progress over time
        </p>
      </div>

      {/* Dog Selector */}
      <div>
        <label htmlFor="dog-select" className="block text-sm font-medium text-gray-700">
          Select Dog
        </label>
        <select
          id="dog-select"
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          value={selectedDog}
          onChange={(e) => setSelectedDog(e.target.value)}
        >
          <option value="">Select a dog</option>
          {/* Add dog options from API */}
        </select>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Success Rate"
          value="85%"
          description="Across all commands"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Commands Mastered"
          value="3"
          description="Above 90% success rate"
          trend={{ value: 1, isPositive: true }}
        />
        <StatCard
          title="Active Commands"
          value="5"
          description="Currently in training"
        />
        <StatCard
          title="Training Sessions"
          value="24"
          description="Last 30 days"
          trend={{ value: 20, isPositive: true }}
        />
      </div>

      {/* Progress Charts */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Command Progress</h2>
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(mockProgressData.commands).map(([command, data]) => (
            <ProgressChart
              key={command}
              command={command}
              data={{
                dates: mockProgressData.dates,
                metrics: data.metrics,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
