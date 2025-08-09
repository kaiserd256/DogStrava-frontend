'use client'

interface CommandProgressProps {
  command: string
  metrics: {
    withTreats: number
    withVerbalCommand: number
    withHandSignal: number
    withDistractions: number
  }
}

export function CommandProgress({ command, metrics }: CommandProgressProps) {
  const categories = [
    { name: 'With Treats', value: metrics.withTreats },
    { name: 'Verbal Command', value: metrics.withVerbalCommand },
    { name: 'Hand Signal', value: metrics.withHandSignal },
    { name: 'With Distractions', value: metrics.withDistractions },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{command}</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
              <span className="text-sm text-gray-500">{category.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-forest rounded-full h-2 transition-all duration-500"
                style={{ width: `${category.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
