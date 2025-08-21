'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Trophy, Target, Clock, MapPin } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { formatDistanceToNow } from '@/lib/utils'

// Types for media
type MediaItem = {
  type: 'image'
  url: string
  alt: string
} | {
  type: 'video'
  url: string
  alt: string
  thumbnail: string
}

// Mock data for the activity feed
const mockPosts = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      accountType: 'owner' as const,
    },
    dog: {
      id: 'dog1',
      name: 'Max',
      breed: 'Golden Retriever',
      avatar: '/api/placeholder/60/60',
    },
    type: 'training' as const,
    content: 'Max nailed his recall training today! 🎾 We practiced in the park with lots of distractions and he came every single time. So proud of this good boy!',
    media: [
      { type: 'image' as const, url: '/api/placeholder/400/300', alt: 'Max running in park' }
    ] as MediaItem[],
    training: {
      command: 'Recall',
      duration: 30,
      successRate: 100,
      location: 'Central Park',
    },
    stats: {
      likes: 24,
      comments: 8,
      shares: 3,
    },
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Happy Tails Rescue',
      avatar: '/api/placeholder/40/40',
      accountType: 'rescue' as const,
    },
    dog: {
      id: 'dog2',
      name: 'Luna',
      breed: 'Border Collie Mix',
      avatar: '/api/placeholder/60/60',
    },
    type: 'achievement' as const,
    content: 'Luna just completed her basic obedience program! 🏆 This sweet girl went from being reactive to other dogs to confidently sitting and staying around distractions. Ready for her forever home!',
    media: [
      { type: 'image' as const, url: '/api/placeholder/400/300', alt: 'Luna with certificate' }
    ] as MediaItem[],
    achievement: {
      title: 'Basic Obedience Graduate',
      level: 'Beginner',
      commands: ['Sit', 'Stay', 'Down', 'Come'],
    },
    stats: {
      likes: 67,
      comments: 15,
      shares: 12,
    },
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      accountType: 'owner' as const,
    },
    dog: {
      id: 'dog3',
      name: 'Bella',
      breed: 'German Shepherd',
      avatar: '/api/placeholder/60/60',
    },
    type: 'training' as const,
    content: 'Working on Bella\'s protection training today. She\'s getting so much better at controlled aggression and release commands. Training with a professional is making all the difference!',
    media: [
      { type: 'video' as const, url: '/api/placeholder/400/300', alt: 'Bella training video', thumbnail: '/api/placeholder/400/300' }
    ] as MediaItem[],
    training: {
      command: 'Protection Work',
      duration: 60,
      successRate: 85,
      location: 'K9 Training Center',
    },
    stats: {
      likes: 31,
      comments: 12,
      shares: 5,
    },
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
]

type FilterType = 'all' | 'following' | 'training' | 'achievements'

export function ActivityFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [posts, setPosts] = useState(mockPosts)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            stats: {
              ...post.stats,
              likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1
            }
          }
        : post
    ))
  }

  const filteredPosts = posts.filter(post => {
    switch (activeFilter) {
      case 'training':
        return post.type === 'training'
      case 'achievements':
        return post.type === 'achievement'
      case 'following':
        // In real app, this would filter by followed users
        return true
      default:
        return true
    }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Filter Tabs */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 pb-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { key: 'all', label: 'All Posts', icon: null },
            { key: 'following', label: 'Following', icon: null },
            { key: 'training', label: 'Training', icon: Target },
            { key: 'achievements', label: 'Achievements', icon: Trophy },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as FilterType)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="dogstrava-card">
            {/* Post Header */}
            <div className="p-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{post.user.name}</h3>
                      <Badge variant={post.user.accountType === 'rescue' ? 'secondary' : 'outline'} className="text-xs">
                        {post.user.accountType === 'rescue' ? 'Rescue' : 'Owner'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>with</span>
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <img src={post.dog.avatar} alt={post.dog.name} className="w-full h-full object-cover" />
                        </Avatar>
                        <span className="font-medium">{post.dog.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDistanceToNow(post.createdAt)} ago</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>

            {/* Training/Achievement Info */}
            {post.type === 'training' && post.training && (
              <div className="px-4 pb-3">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Training Session</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Command:</span>
                      <span className="font-medium">{post.training.command}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{post.training.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Success:</span>
                      <span className={`font-medium ${post.training.successRate >= 80 ? 'text-success-600' : 'text-warning-600'}`}>
                        {post.training.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate">{post.training.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {post.type === 'achievement' && post.achievement && (
              <div className="px-4 pb-3">
                <div className="bg-gradient-to-r from-success-50 to-primary-50 border border-success-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-success-600" />
                    <span className="font-medium text-sm text-success-900">{post.achievement.title}</span>
                    <Badge variant="outline" className="text-xs border-success-300 text-success-700">
                      {post.achievement.level}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.achievement.commands.map((command) => (
                      <Badge key={command} variant="secondary" className="text-xs">
                        {command}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="px-4 pb-3">
                <div className="rounded-lg overflow-hidden bg-muted">
                  {post.media[0].type === 'image' ? (
                    <img 
                      src={post.media[0].url} 
                      alt={post.media[0].alt}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="relative">
                      <img 
                        src={post.media[0].type === 'video' ? (post.media[0] as any).thumbnail : post.media[0].url} 
                        alt={post.media[0].alt}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="px-4 py-3 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      post.isLiked 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.stats.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.stats.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>{post.stats.shares}</span>
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {post.dog.breed}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" className="dogstrava-button-secondary">
          Load More Posts
        </Button>
      </div>
    </div>
  )
}
