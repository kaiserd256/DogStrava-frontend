import { QueryClient } from '@tanstack/react-query'

// Create a query client with optimized defaults for DogStrava
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: How long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus for critical data
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 1
      },
      
      // Mutation retry delay
      retryDelay: 1000,
    },
  },
})

// Query key factory for consistent and hierarchical keys
export const queryKeys = {
  // Posts and social feed
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: { type?: string; userId?: string; dogId?: string }) => 
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    feed: (filters?: { following?: boolean; type?: string }) => 
      [...queryKeys.posts.all, 'feed', filters] as const,
  },
  
  // Training sessions and progress
  training: {
    all: ['training'] as const,
    sessions: () => [...queryKeys.training.all, 'sessions'] as const,
    session: (id: string) => [...queryKeys.training.sessions(), id] as const,
    dogSessions: (dogId: string, filters?: { command?: string; dateRange?: string }) => 
      [...queryKeys.training.sessions(), 'dog', dogId, filters] as const,
    analytics: () => [...queryKeys.training.all, 'analytics'] as const,
    dogAnalytics: (dogId: string, timeframe?: string) => 
      [...queryKeys.training.analytics(), dogId, timeframe] as const,
    progress: (dogId: string, command?: string) => 
      [...queryKeys.training.all, 'progress', dogId, command] as const,
  },
  
  // Dogs and profiles
  dogs: {
    all: ['dogs'] as const,
    lists: () => [...queryKeys.dogs.all, 'list'] as const,
    userDogs: (userId: string) => [...queryKeys.dogs.lists(), 'user', userId] as const,
    details: () => [...queryKeys.dogs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.dogs.details(), id] as const,
    stats: (id: string) => [...queryKeys.dogs.all, 'stats', id] as const,
    achievements: (id: string) => [...queryKeys.dogs.all, 'achievements', id] as const,
  },
  
  // Users and social connections
  users: {
    all: ['users'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
    following: (userId: string) => [...queryKeys.users.all, 'following', userId] as const,
    followers: (userId: string) => [...queryKeys.users.all, 'followers', userId] as const,
    search: (query: string, filters?: { location?: string; hasDogs?: boolean }) => 
      [...queryKeys.users.all, 'search', query, filters] as const,
  },
  
  // Media and uploads
  media: {
    all: ['media'] as const,
    upload: () => [...queryKeys.media.all, 'upload'] as const,
    presignedUrl: (filename: string, type: string) => 
      [...queryKeys.media.all, 'presigned', filename, type] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (userId: string, filters?: { read?: boolean; type?: string }) => 
      [...queryKeys.notifications.all, 'list', userId, filters] as const,
    unreadCount: (userId: string) => 
      [...queryKeys.notifications.all, 'unreadCount', userId] as const,
  },
} as const

// Helper function to invalidate related queries
export const invalidateQueries = {
  // Invalidate all post-related queries
  posts: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
  
  // Invalidate specific post
  post: (postId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) }),
  
  // Invalidate user's posts
  userPosts: (userId: string) => queryClient.invalidateQueries({ 
    queryKey: queryKeys.posts.list({ userId }) 
  }),
  
  // Invalidate training data for a dog
  dogTraining: (dogId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.training.dogSessions(dogId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.training.dogAnalytics(dogId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.dogs.stats(dogId) })
  },
  
  // Invalidate social connections
  socialConnections: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.following(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(userId) })
  },
}

// Prefetch helpers for common scenarios
export const prefetchQueries = {
  // Prefetch user's dogs when they log in
  userDogs: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.dogs.userDogs(userId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  },
  
  // Prefetch activity feed
  activityFeed: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.feed(),
      staleTime: 2 * 60 * 1000, // 2 minutes for fresh social content
    })
  },
  
  // Prefetch dog profile when navigating
  dogProfile: async (dogId: string) => {
    await Promise.all([
      queryClient.prefetchQuery({ queryKey: queryKeys.dogs.detail(dogId) }),
      queryClient.prefetchQuery({ queryKey: queryKeys.dogs.stats(dogId) }),
      queryClient.prefetchQuery({ queryKey: queryKeys.training.dogAnalytics(dogId) }),
    ])
  },
}
