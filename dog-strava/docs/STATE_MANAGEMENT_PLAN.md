# DogStrava State Management & Data Fetching Architecture

## 🎯 **Overview**

This document outlines the comprehensive state management and data fetching strategy for DogStrava, designed to provide excellent UX, maintainability, and scalability.

## 🏗️ **Architecture Layers**

### **1. Client State (Zustand)**
- **Purpose**: UI state, user preferences, temporary data
- **Scope**: Component-level interactions, form state, UI toggles
- **Persistence**: Local storage for user preferences

### **2. Server State (TanStack Query)**
- **Purpose**: API data, caching, synchronization
- **Scope**: All server data (posts, dogs, training sessions, users)
- **Features**: Background updates, optimistic updates, infinite queries

### **3. Authentication State (Zustand + AWS Cognito)**
- **Purpose**: User authentication, session management
- **Integration**: AWS Cognito with Zustand for UI state

## 📊 **State Structure**

### **Client State Stores (Zustand)**

```typescript
// Current stores (already implemented)
- authStore: Authentication state and actions
- appStore: UI state (sidebar, theme, notifications)
- userStore: Current user profile and dogs

// New stores to implement
- uiStore: Global UI state (modals, loading states, toasts)
- preferencesStore: User preferences and settings
```

### **Server State Queries (TanStack Query)**

```typescript
// Query Categories
- Posts: Social feed, user posts, post details
- Training: Sessions, progress, analytics
- Dogs: Profiles, stats, achievements
- Social: Following, followers, user discovery
- Media: Image/video uploads and management
```

## 🔄 **Data Flow Patterns**

### **1. Read Operations (Queries)**
```
Component → useQuery → API Client → AWS Lambda → Database
         ← Cache ← Response ← Response ← Response
```

### **2. Write Operations (Mutations)**
```
Component → useMutation → Optimistic Update → API Client → AWS Lambda
         ← UI Update ← Success/Error ← Response ← Response
```

### **3. Real-time Updates**
```
Background → Query Invalidation → Refetch → UI Update
WebSocket → Event Handler → Cache Update → Component Re-render
```

## 🛠️ **Implementation Strategy**

### **Phase 1: Core Infrastructure**
1. **Set up TanStack Query**
   - Configure QueryClient with optimal defaults
   - Set up error boundaries and loading states
   - Implement query key factory pattern

2. **Enhance API Client**
   - Add request/response interceptors
   - Implement retry logic and error handling
   - Add request deduplication

3. **Create Query Hooks**
   - Posts queries (feed, user posts, post details)
   - Training queries (sessions, analytics, progress)
   - User queries (profile, dogs, following)

### **Phase 2: Advanced Features**
1. **Optimistic Updates**
   - Like/unlike posts
   - Follow/unfollow users
   - Create training sessions

2. **Infinite Queries**
   - Activity feed pagination
   - Training session history
   - User search results

3. **Background Sync**
   - Periodic data refresh
   - Offline support preparation
   - Cache invalidation strategies

### **Phase 3: Performance Optimization**
1. **Smart Caching**
   - Stale-while-revalidate patterns
   - Selective cache invalidation
   - Memory optimization

2. **Prefetching**
   - Route-based prefetching
   - User behavior prediction
   - Critical data preloading

## 📝 **Query Key Strategy**

### **Hierarchical Query Keys**
```typescript
// Factory pattern for consistent query keys
const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: PostFilters) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
  training: {
    all: ['training'] as const,
    sessions: () => [...queryKeys.training.all, 'sessions'] as const,
    session: (id: string) => [...queryKeys.training.sessions(), id] as const,
    analytics: (dogId: string) => [...queryKeys.training.all, 'analytics', dogId] as const,
  },
  // ... more query keys
}
```

## 🔄 **Mutation Patterns**

### **Optimistic Updates Example**
```typescript
const useLikePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) })
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData(queryKeys.posts.detail(postId))
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.posts.detail(postId), (old) => ({
        ...old,
        isLiked: !old.isLiked,
        likes: old.isLiked ? old.likes - 1 : old.likes + 1
      }))
      
      return { previousPost }
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.posts.detail(postId), context.previousPost)
    },
    onSettled: (postId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) })
    },
  })
}
```

## 🎨 **UI State Patterns**

### **Loading States**
```typescript
// Global loading state for critical operations
const useGlobalLoading = () => {
  const { isLoading: isPostsLoading } = usePostsQuery()
  const { isLoading: isUserLoading } = useUserQuery()
  
  return isPostsLoading || isUserLoading
}

// Component-level loading states
const { data, isLoading, error } = useTrainingSessionsQuery(dogId)
```

### **Error Handling**
```typescript
// Global error boundary with retry capabilities
// Component-level error states with user-friendly messages
// Network error detection and offline mode
```

## 📱 **Mobile & Offline Considerations**

### **Data Persistence**
- Critical data cached in IndexedDB
- Offline-first approach for core features
- Sync queue for offline actions

### **Performance**
- Lazy loading for non-critical data
- Image optimization and lazy loading
- Bundle splitting by feature

## 🔐 **Security & Privacy**

### **Data Protection**
- Sensitive data encryption in local storage
- Automatic token refresh
- Secure API communication

### **Privacy Controls**
- Granular data fetching based on privacy settings
- User consent management
- Data retention policies

## 🧪 **Testing Strategy**

### **Query Testing**
- Mock Service Worker for API mocking
- Query state testing with React Testing Library
- Integration tests for critical flows

### **State Testing**
- Zustand store unit tests
- State persistence testing
- Error scenario testing

## 📈 **Monitoring & Analytics**

### **Performance Metrics**
- Query performance tracking
- Cache hit rates
- Error rate monitoring

### **User Experience**
- Loading time analytics
- User interaction tracking
- Feature usage metrics

## 🚀 **Migration Strategy**

### **From Mock Data to Real API**
1. **Replace mock data with query hooks**
2. **Implement error boundaries**
3. **Add loading states**
4. **Test with real API endpoints**

### **Gradual Implementation**
1. **Start with read-only queries**
2. **Add mutations for critical features**
3. **Implement optimistic updates**
4. **Add advanced features (infinite queries, etc.)**

## 🔧 **Development Tools**

### **Debugging**
- TanStack Query DevTools
- Zustand DevTools
- Network request monitoring

### **Code Quality**
- TypeScript for type safety
- ESLint rules for query patterns
- Automated testing for state logic

---

This architecture provides a solid foundation for building a scalable, performant, and maintainable DogStrava application that can grow with your user base and feature requirements.
