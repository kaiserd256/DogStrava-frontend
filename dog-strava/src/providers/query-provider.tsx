'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { isAuthenticated, user } = useAuthStore()

  // Clear queries when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.clear()
    }
  }, [isAuthenticated])

  // Set up global error handling
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'observerResultsUpdated') {
        const { query } = event
        if (query.state.error) {
          // Handle global query errors
          console.error('Query error:', query.state.error)
          
          // You could show a global error toast here
          // const { showError } = useToasts()
          // showError('Something went wrong', 'Please try again later')
        }
      }
    })

    return unsubscribe
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
