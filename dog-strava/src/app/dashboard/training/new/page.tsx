'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TrainingActivity } from '@/types'
import { XMarkIcon } from '@heroicons/react/24/outline'

const trainingSessionSchema = z.object({
  dogId: z.string().min(1, 'Please select a dog'),
  activities: z.array(z.object({
    command: z.string().min(1, 'Command is required'),
    successRate: z.number().min(0).max(100),
    metrics: z.object({
      withTreats: z.number().min(0).max(100),
      withVerbalCommand: z.number().min(0).max(100),
      withHandSignal: z.number().min(0).max(100),
      withDistractions: z.number().min(0).max(100),
    }),
    notes: z.string().optional(),
  })).min(1, 'At least one activity is required'),
  notes: z.string().optional(),
  visibility: z.enum(['public', 'private', 'friends']),
})

type TrainingSessionForm = z.infer<typeof trainingSessionSchema>

const defaultActivity: TrainingActivity = {
  command: '',
  successRate: 0,
  metrics: {
    withTreats: 0,
    withVerbalCommand: 0,
    withHandSignal: 0,
    withDistractions: 0,
  },
}

export default function NewTrainingPage() {
  const [activities, setActivities] = useState<TrainingActivity[]>([{ ...defaultActivity }])
  
  const { register, handleSubmit, formState: { errors } } = useForm<TrainingSessionForm>({
    resolver: zodResolver(trainingSessionSchema),
    defaultValues: {
      visibility: 'public',
      activities: [defaultActivity],
    },
  })

  const onSubmit = async (data: TrainingSessionForm) => {
    console.log(data)
    // TODO: Submit to API
  }

  const addActivity = () => {
    setActivities([...activities, { ...defaultActivity }])
  }

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Training Session</h1>
          <p className="mt-1 text-sm text-gray-500">
            Record a new training session for your dog
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dog Selection */}
          <div>
            <label htmlFor="dogId" className="block text-sm font-medium text-gray-700">
              Select Dog
            </label>
            <select
              id="dogId"
              {...register('dogId')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            >
              <option value="">Select a dog</option>
              {/* TODO: Add dog options from API */}
            </select>
            {errors.dogId && (
              <p className="mt-1 text-sm text-warm">{errors.dogId.message}</p>
            )}
          </div>

          {/* Activities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Activities</h2>
              <button
                type="button"
                onClick={addActivity}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Add Activity
              </button>
            </div>

            {activities.map((_, index) => (
              <div key={index} className="relative bg-white p-6 rounded-xl border border-gray-200">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    onClick={() => removeActivity(index)}
                    className="text-gray-400 hover:text-warm"
                    disabled={activities.length === 1}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Command
                    </label>
                    <input
                      type="text"
                      {...register(`activities.${index}.command`)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Success Rate (%)</h3>
                    {['withTreats', 'withVerbalCommand', 'withHandSignal', 'withDistractions'].map((metric) => (
                      <div key={metric}>
                        <label className="block text-sm text-gray-500 mb-1">
                          {metric.split(/(?=[A-Z])/).join(' ')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          {...register(`activities.${index}.metrics.${metric}` as any, {
                            valueAsNumber: true,
                          })}
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              {...register('notes')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Visibility */}
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <select
              id="visibility"
              {...register('visibility')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
