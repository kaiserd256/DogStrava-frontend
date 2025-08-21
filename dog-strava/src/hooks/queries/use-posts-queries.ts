import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { queryKeys, invalidateQueries } from '@/lib/query-client'
import { useAuthStore } from '@/stores'

// Types for better TypeScript support
export interface Post {
  id: string
  userId: string
  dogId?: string
  type: 'general' | 'training' | 'achievement'
  title: string
  content: string
  media?: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }>
  location?: string
  isLiked: boolean
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  dog?: {
    id: string
    name: string
    avatar?: string
  }
  trainingData?: {
    command: string
    duration: number
    successRate: number
    treats: number
    mood: string
  }
  achievementData?: {
    command: string
    level: string
    description: string
  }
}

export interface PostFilters {
  type?: 'general' | 'training' | 'achievement'
  following?: boolean
  userId?: string
  dogId?: string
}

// Activity Feed Query (with infinite scroll)
export const useActivityFeedQuery = (filters: PostFilters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.feed(filters),
    queryFn: ({ pageParam = 1 }) =>
      api.posts.getFeed({ page: pageParam as number, limit: 10, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      // Assuming API returns hasMore or similar pagination info
      const hasMore = lastPage?.data?.length === 10
      return hasMore ? pages.length + 1 : undefined
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for fresh social content
    enabled: true, // Always enabled for activity feed
  })
}

// Single Post Query
export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => api.posts.getPost(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// User Posts Query
export const useUserPostsQuery = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ userId }),
    queryFn: () => api.posts.getUserPosts(userId),
    enabled: !!userId && enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

// Post Comments Query
export const usePostCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: [...queryKeys.posts.detail(postId), 'comments'],
    queryFn: () => api.posts.getComments(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute for comments
  })
}

// Create Post Mutation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: api.posts.createPost,
    onSuccess: (newPost) => {
      // Invalidate and refetch activity feed
      invalidateQueries.posts()
      
      // Add new post to user's posts cache
      if (user?.id) {
        queryClient.setQueryData(
          queryKeys.posts.list({ userId: user.id }),
          (oldData: any) => {
            if (!oldData) return { data: [newPost.data] }
            return {
              ...oldData,
              data: [newPost.data, ...oldData.data]
            }
          }
        )
      }
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
      // You could show a toast notification here
    },
  })
}

// Like Post Mutation with Optimistic Updates
export const useLikePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      return isLiked ? api.posts.unlikePost(postId) : api.posts.likePost(postId)
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) })

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(queryKeys.posts.detail(postId))

      // Optimistically update the post
      queryClient.setQueryData(queryKeys.posts.detail(postId), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            isLiked: !isLiked,
            likes: isLiked ? old.data.likes - 1 : old.data.likes + 1
          }
        }
      })

      // Also update in feed cache if present
      queryClient.setQueriesData(
        { queryKey: queryKeys.posts.feed() },
        (oldData: any) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((post: Post) =>
                post.id === postId
                  ? {
                      ...post,
                      isLiked: !isLiked,
                      likes: isLiked ? post.likes - 1 : post.likes + 1
                    }
                  : post
              )
            }))
          }
        }
      )

      return { previousPost }
    },
    onError: (err, { postId }, context) => {
      // Rollback optimistic update on error
      if (context?.previousPost) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), context.previousPost)
      }
      console.error('Failed to toggle like:', err)
    },
    onSettled: (data, error, { postId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) })
    },
  })
}

// Delete Post Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.posts.deletePost,
    onSuccess: (_, postId) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) })
      
      // Invalidate lists to refetch without the deleted post
      invalidateQueries.posts()
    },
    onError: (error) => {
      console.error('Failed to delete post:', error)
    },
  })
}

// Create Comment Mutation
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      api.posts.createComment(postId, { content }),
    onSuccess: (newComment, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.posts.detail(postId), 'comments']
      })
      
      // Update comment count in post cache
      queryClient.setQueryData(queryKeys.posts.detail(postId), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            comments: old.data.comments + 1
          }
        }
      })
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
    },
  })
}

// Custom hook for post interactions
export const usePostInteractions = (postId: string) => {
  const likePostMutation = useLikePostMutation()
  const createCommentMutation = useCreateCommentMutation()
  const deletePostMutation = useDeletePostMutation()

  const toggleLike = (isCurrentlyLiked: boolean) => {
    likePostMutation.mutate({ postId, isLiked: isCurrentlyLiked })
  }

  const addComment = (content: string) => {
    createCommentMutation.mutate({ postId, content })
  }

  const deletePost = () => {
    deletePostMutation.mutate(postId)
  }

  return {
    toggleLike,
    addComment,
    deletePost,
    isLiking: likePostMutation.isPending,
    isCommenting: createCommentMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  }
}
