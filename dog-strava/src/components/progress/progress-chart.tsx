'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ProgressChartProps {
  command: string
  data: {
    dates: string[]
    metrics: {
      withTreats: number[]
      withVerbalCommand: number[]
      withHandSignal: number[]
      withDistractions: number[]
    }
  }
}

export function ProgressChart({ command, data }: ProgressChartProps) {
  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'With Treats',
        data: data.metrics.withTreats,
        borderColor: '#C4A484',
        backgroundColor: 'rgba(196, 164, 132, 0.5)',
      },
      {
        label: 'Verbal Command',
        data: data.metrics.withVerbalCommand,
        borderColor: '#4B7F52',
        backgroundColor: 'rgba(75, 127, 82, 0.5)',
      },
      {
        label: 'Hand Signal',
        data: data.metrics.withHandSignal,
        borderColor: '#6B9AC4',
        backgroundColor: 'rgba(107, 154, 196, 0.5)',
      },
      {
        label: 'With Distractions',
        data: data.metrics.withDistractions,
        borderColor: '#D64045',
        backgroundColor: 'rgba(214, 64, 69, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `${command} Progress Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Success Rate (%)',
        },
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <Line data={chartData} options={options} />
    </div>
  )
}
