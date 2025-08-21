// App constants
export const APP_NAME = 'DogStrava';

// Training commands
export const PRESET_COMMANDS = [
  { id: 'sit', name: 'Sit', description: 'Basic sit command' },
  { id: 'stay', name: 'Stay', description: 'Stay in place command' },
  { id: 'recall', name: 'Recall', description: 'Come when called' },
];

// Activity types
export const ACTIVITY_TYPES = [
  { id: 'training', name: 'Training Session', icon: '🎯' },
  { id: 'walk', name: 'Walk', icon: '🚶' },
  { id: 'park', name: 'Dog Park', icon: '🏞️' },
  { id: 'other', name: 'Other Activity', icon: '🐕' },
];

// Media constraints
export const MEDIA_CONSTRAINTS = {
  MAX_VIDEO_DURATION: 5 * 60, // 5 minutes in seconds
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB in bytes
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/mov'],
};

// API endpoints (will be configured based on environment)
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  DOGS: '/dogs',
  TRAINING: '/training',
  POSTS: '/posts',
  MEDIA: '/media',
};
