import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { queryKeys, invalidateQueries } from '@/lib/query-client'

// Types for training data
export interface TrainingSession {
  id: string
  dogId: string
  command: string
  duration: number
  successRate: number
  treats: number
  mood: 'excited' | 'focused' | 'distracted' | 'tired'
  location?: string
  notes?: string
  media?: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }>
  distractions: string[]
  createdAt: string
  updatedAt: string
  dog: {
    id: string
    name: string
    avatar?: string
  }
}

export interface TrainingAnalytics {
  totalSessions: number
  totalTrainingTime: number
  averageSuccessRate: number
  commandsLearned: number
  progressByCommand: Array<{
    command: string
    sessions: number
    averageSuccessRate: number
    trend: 'improving' | 'stable' | 'declining'
    lastSession: string
  }>
  weeklyProgress: Array<{
    week: string
    sessions: number
    totalTime: number
    averageSuccessRate: number
  }>
  achievements: Array<{
    id: string
    command: string
    level: string
    unlockedAt: string
  }>
}

export interface TrainingFilters {
  command?: string
  dateRange?: 'week' | 'month' | 'quarter' | 'year'
  startDate?: string
  endDate?: string
}

// Training Sessions Query
export const useTrainingSessionsQuery = (dogId: string, filters: TrainingFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.training.dogSessions(dogId, filters),
    queryFn: () => api.training.getSessions({ dogId, ...filters }),
    enabled: !!dogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Single Training Session Query
export const useTrainingSessionQuery = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.training.session(sessionId),
    queryFn: () => api.training.getSession(sessionId),
    enabled: !!sessionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Training Analytics Query
export const useTrainingAnalyticsQuery = (dogId: string, timeframe = 'month') => {
  return useQuery({
    queryKey: queryKeys.training.dogAnalytics(dogId, timeframe),
    queryFn: () => api.training.getAnalytics(dogId, { timeframe }),
    enabled: !!dogId,
    staleTime: 15 * 60 * 1000, // 15 minutes for analytics
  })
}

// Training Progress Query
export const useTrainingProgressQuery = (dogId: string, command?: string) => {
  return useQuery({
    queryKey: queryKeys.training.progress(dogId, command),
    queryFn: () => api.training.getProgress(dogId, command),
    enabled: !!dogId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create Training Session Mutation
export const useCreateTrainingSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.training.createSession,
    onSuccess: (newSession, variables) => {
      const dogId = variables.dogId
      
      // Invalidate all training-related queries for this dog
      invalidateQueries.dogTraining(dogId)
      
      // Optimistically add to sessions cache
      queryClient.setQueryData(
        queryKeys.training.dogSessions(dogId),
        (oldData: any) => {
          if (!oldData) return { data: [newSession.data] }
          return {
            ...oldData,
            data: [newSession.data, ...oldData.data]
          }
        }
      )
    },
    onError: (error) => {
      console.error('Failed to create training session:', error)
    },
  })
}

// Update Training Session Mutation
export const useUpdateTrainingSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: any }) =>
      api.training.updateSession(sessionId, data),
    onMutate: async ({ sessionId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.training.session(sessionId) })

      // Snapshot previous value
      const previousSession = queryClient.getQueryData(queryKeys.training.session(sessionId))

      // Optimistically update
      queryClient.setQueryData(queryKeys.training.session(sessionId), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: { ...old.data, ...data }
        }
      })

      return { previousSession }
    },
    onError: (err, { sessionId }, context) => {
      // Rollback on error
      if (context?.previousSession) {
        queryClient.setQueryData(queryKeys.training.session(sessionId), context.previousSession)
      }
      console.error('Failed to update training session:', err)
    },
    onSettled: (data, error, { sessionId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.training.session(sessionId) })
      
      // Also invalidate related queries
      if (data?.data?.dogId) {
        invalidateQueries.dogTraining(data.data.dogId)
      }
    },
  })
}

// Delete Training Session Mutation
export const useDeleteTrainingSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.training.deleteSession,
    onSuccess: (_, sessionId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.training.session(sessionId) })
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.training.sessions() })
    },
    onError: (error) => {
      console.error('Failed to delete training session:', error)
    },
  })
}

// Custom hook for training session interactions
export const useTrainingSessionInteractions = (sessionId: string) => {
  const updateSessionMutation = useUpdateTrainingSessionMutation()
  const deleteSessionMutation = useDeleteTrainingSessionMutation()

  const updateSession = (data: Partial<TrainingSession>) => {
    updateSessionMutation.mutate({ sessionId, data })
  }

  const deleteSession = () => {
    deleteSessionMutation.mutate(sessionId)
  }

  return {
    updateSession,
    deleteSession,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  }
}

// Custom hook for training statistics
export const useTrainingStats = (dogId: string) => {
  const analyticsQuery = useTrainingAnalyticsQuery(dogId)
  const sessionsQuery = useTrainingSessionsQuery(dogId)

  const stats = {
    totalSessions: analyticsQuery.data?.data?.totalSessions || 0,
    totalTrainingTime: analyticsQuery.data?.data?.totalTrainingTime || 0,
    averageSuccessRate: analyticsQuery.data?.data?.averageSuccessRate || 0,
    commandsLearned: analyticsQuery.data?.data?.commandsLearned || 0,
    recentSessions: sessionsQuery.data?.data?.slice(0, 5) || [],
    isLoading: analyticsQuery.isLoading || sessionsQuery.isLoading,
    error: analyticsQuery.error || sessionsQuery.error,
  }

  return stats
}
