import { getCurrentUser } from 'aws-amplify/auth'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.dogstrava.com'

// Request types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

// Enhanced API client with authentication and error handling
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Get authentication token
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = await getCurrentUser()
      // In a real implementation, you'd get the JWT token from Cognito
      // For now, we'll use a placeholder
      return user ? 'mock-jwt-token' : null
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      return null
    }
  }

  // Build request headers with authentication
  private async buildHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    
    const token = await this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  // Generic request method with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const headers = await this.buildHeaders(options.headers as Record<string, string>)
      
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle non-JSON responses (like file uploads)
      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (!response.ok) {
        const errorData = isJson ? await response.json() : { message: response.statusText }
        throw {
          message: errorData.message || 'Request failed',
          status: response.status,
          code: errorData.code,
        } as ApiError
      }

      return isJson ? await response.json() : (response as T)
    } catch (error) {
      // Network or parsing errors
      if (error instanceof TypeError) {
        throw {
          message: 'Network error - please check your connection',
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }
      
      // Re-throw API errors
      throw error
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return this.request<T>(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // File upload with progress tracking
  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    const headers = await this.buildHeaders()
    delete headers['Content-Type'] // Let browser set it for FormData

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText)
          }
        } else {
          reject({
            message: 'Upload failed',
            status: xhr.status,
            code: 'UPLOAD_ERROR',
          } as ApiError)
        }
      })

      xhr.addEventListener('error', () => {
        reject({
          message: 'Network error during upload',
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError)
      })

      xhr.open('POST', `${this.baseURL}${endpoint}`)
      
      // Set headers (excluding Content-Type)
      Object.entries(headers).forEach(([key, value]) => {
        if (key !== 'Content-Type') {
          xhr.setRequestHeader(key, value)
        }
      })

      xhr.send(formData)
    })
  }
}

// Create and export API client instance
export const apiClient = new ApiClient()

// API endpoint functions organized by feature
export const api = {
  // Authentication
  auth: {
    getCurrentUser: () => apiClient.get<any>('/auth/me'),
    updateProfile: (data: any) => apiClient.put<any>('/auth/profile', data),
  },

  // Posts and social feed
  posts: {
    getFeed: (params?: { page?: number; limit?: number; following?: boolean; type?: string }) =>
      apiClient.get<ApiResponse<any[]>>('/posts/feed', params),
    
    getUserPosts: (userId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get<ApiResponse<any[]>>(`/posts/user/${userId}`, params),
    
    getPost: (postId: string) =>
      apiClient.get<ApiResponse<any>>(`/posts/${postId}`),
    
    createPost: (data: any) =>
      apiClient.post<ApiResponse<any>>('/posts', data),
    
    updatePost: (postId: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/posts/${postId}`, data),
    
    deletePost: (postId: string) =>
      apiClient.delete<ApiResponse<void>>(`/posts/${postId}`),
    
    likePost: (postId: string) =>
      apiClient.post<ApiResponse<void>>(`/posts/${postId}/like`),
    
    unlikePost: (postId: string) =>
      apiClient.delete<ApiResponse<void>>(`/posts/${postId}/like`),
    
    getComments: (postId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get<ApiResponse<any[]>>(`/posts/${postId}/comments`, params),
    
    createComment: (postId: string, data: { content: string }) =>
      apiClient.post<ApiResponse<any>>(`/posts/${postId}/comments`, data),
  },

  // Training sessions and progress
  training: {
    getSessions: (params?: { dogId?: string; command?: string; page?: number; limit?: number }) =>
      apiClient.get<ApiResponse<any[]>>('/training/sessions', params),
    
    getSession: (sessionId: string) =>
      apiClient.get<ApiResponse<any>>(`/training/sessions/${sessionId}`),
    
    createSession: (data: any) =>
      apiClient.post<ApiResponse<any>>('/training/sessions', data),
    
    updateSession: (sessionId: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/training/sessions/${sessionId}`, data),
    
    deleteSession: (sessionId: string) =>
      apiClient.delete<ApiResponse<void>>(`/training/sessions/${sessionId}`),
    
    getAnalytics: (dogId: string, params?: { timeframe?: string; command?: string }) =>
      apiClient.get<ApiResponse<any>>(`/training/analytics/${dogId}`, params),
    
    getProgress: (dogId: string, command?: string) =>
      apiClient.get<ApiResponse<any>>(`/training/progress/${dogId}`, { command }),
  },

  // Dogs and profiles
  dogs: {
    getUserDogs: (userId?: string) =>
      apiClient.get<ApiResponse<any[]>>('/dogs', userId ? { userId } : undefined),
    
    getDog: (dogId: string) =>
      apiClient.get<ApiResponse<any>>(`/dogs/${dogId}`),
    
    createDog: (data: any) =>
      apiClient.post<ApiResponse<any>>('/dogs', data),
    
    updateDog: (dogId: string, data: any) =>
      apiClient.put<ApiResponse<any>>(`/dogs/${dogId}`, data),
    
    deleteDog: (dogId: string) =>
      apiClient.delete<ApiResponse<void>>(`/dogs/${dogId}`),
    
    getStats: (dogId: string) =>
      apiClient.get<ApiResponse<any>>(`/dogs/${dogId}/stats`),
    
    getAchievements: (dogId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/dogs/${dogId}/achievements`),
  },

  // Users and social connections
  users: {
    getUser: (userId: string) =>
      apiClient.get<ApiResponse<any>>(`/users/${userId}`),
    
    searchUsers: (query: string, params?: { location?: string; hasDogs?: boolean }) =>
      apiClient.get<ApiResponse<any[]>>('/users/search', { query, ...params }),
    
    getFollowing: (userId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/users/${userId}/following`),
    
    getFollowers: (userId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/users/${userId}/followers`),
    
    followUser: (userId: string) =>
      apiClient.post<ApiResponse<void>>(`/users/${userId}/follow`),
    
    unfollowUser: (userId: string) =>
      apiClient.delete<ApiResponse<void>>(`/users/${userId}/follow`),
  },

  // Media and file uploads
  media: {
    uploadImage: (file: File, onProgress?: (progress: number) => void) =>
      apiClient.uploadFile('/media/upload/image', file, onProgress),
    
    uploadVideo: (file: File, onProgress?: (progress: number) => void) =>
      apiClient.uploadFile('/media/upload/video', file, onProgress),
    
    getPresignedUrl: (filename: string, contentType: string) =>
      apiClient.post<ApiResponse<{ uploadUrl: string; fileUrl: string }>>('/media/presigned-url', {
        filename,
        contentType,
      }),
  },

  // Notifications
  notifications: {
    getNotifications: (params?: { page?: number; limit?: number; read?: boolean }) =>
      apiClient.get<ApiResponse<any[]>>('/notifications', params),
    
    markAsRead: (notificationId: string) =>
      apiClient.patch<ApiResponse<void>>(`/notifications/${notificationId}/read`),
    
    markAllAsRead: () =>
      apiClient.patch<ApiResponse<void>>('/notifications/read-all'),
    
    getUnreadCount: () =>
      apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
  },
}

export default apiClient
