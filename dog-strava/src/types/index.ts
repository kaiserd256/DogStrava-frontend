// Core user types
export interface User {
  id: string;
  email: string;
  username: string;
  accountType: 'owner' | 'rescue';
  profilePicture?: string;
  bio?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dog-related types
export interface Dog {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  profilePicture?: string;
  ownerId: string;
  rescueId?: string;
  createdAt: string;
  updatedAt: string;
}

// Training types
export interface TrainingCommand {
  id: string;
  name: string;
  description?: string;
  isPreset: boolean;
  createdBy: string;
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  dogId: string;
  commandId: string;
  duration: number; // in minutes
  successRate?: number;
  notes?: string;
  testMetrics?: {
    withTreats: number;
    verbalCommand: number;
    handCommand: number;
    withDistractions: number;
  };
  createdAt: string;
}

// Social types
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  activities: Activity[];
  media: MediaItem[];
  visibility: 'public' | 'followers' | 'private';
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'training' | 'walk' | 'park' | 'other';
  dogId: string;
  duration?: number;
  description: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number; // for videos
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
