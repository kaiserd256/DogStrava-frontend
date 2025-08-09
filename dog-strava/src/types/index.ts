export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  isRescue: boolean
  createdAt: string
  updatedAt: string
}

export interface Dog {
  id: string
  name: string
  breed?: string
  age?: number
  imageUrl?: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface TrainingSession {
  id: string
  dogId: string
  date: string
  duration: number
  activities: TrainingActivity[]
  notes?: string
  visibility: 'public' | 'private' | 'friends'
  mediaUrls?: string[]
  createdAt: string
  updatedAt: string
}

export interface TrainingActivity {
  command: string
  successRate: number
  notes?: string
  metrics: {
    withTreats: number
    withVerbalCommand: number
    withHandSignal: number
    withDistractions: number
  }
}

export interface Post {
  id: string
  userId: string
  dogId: string
  title: string
  content?: string
  mediaUrls?: string[]
  trainingSessionId?: string
  visibility: 'public' | 'private' | 'friends'
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
}
