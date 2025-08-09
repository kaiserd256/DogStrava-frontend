'use client'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className="flex items-baseline">
          {trend && (
            <div
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-forest' : 'text-warm'
              } mr-2`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </dd>
    </div>
  )
}
