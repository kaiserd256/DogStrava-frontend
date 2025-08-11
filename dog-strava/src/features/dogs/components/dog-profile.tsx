'use client'

import { useState } from 'react'
import { Edit3, Calendar, MapPin, Award, TrendingUp, Camera, Settings, Share2, Heart } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { formatDistanceToNow } from '@/lib/utils'

// Mock dog data
const mockDog = {
  id: 'dog1',
  name: 'Max',
  breed: 'Golden Retriever',
  age: 3,
  weight: 65,
  avatar: '/api/placeholder/120/120',
  coverPhoto: '/api/placeholder/800/300',
  bio: 'Energetic and loving Golden Retriever who loves fetch, swimming, and learning new tricks! Currently working on advanced obedience and agility training.',
  location: 'San Francisco, CA',
  joinedDate: new Date('2023-01-15'),
  owner: {
    id: 'user1',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
  },
  stats: {
    totalSessions: 127,
    commandsLearned: 18,
    achievements: 8,
    followers: 45,
    following: 32,
  },
  recentAchievements: [
    {
      id: '1',
      title: 'Recall Master',
      description: 'Perfect recall in distracting environments',
      earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      icon: '🎯',
      level: 'Advanced',
    },
    {
      id: '2',
      title: 'Stay Champion',
      description: '5-minute stay with distractions',
      earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: '⏱️',
      level: 'Intermediate',
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Positive interactions with 20+ dogs',
      earnedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      icon: '🦋',
      level: 'Beginner',
    },
  ],
  commandProgress: [
    { command: 'Sit', level: 'Mastered', progress: 100, sessions: 25 },
    { command: 'Stay', level: 'Advanced', progress: 95, sessions: 32 },
    { command: 'Recall', level: 'Advanced', progress: 98, sessions: 45 },
    { command: 'Down', level: 'Mastered', progress: 100, sessions: 20 },
    { command: 'Heel', level: 'Intermediate', progress: 75, sessions: 28 },
    { command: 'Place', level: 'Learning', progress: 60, sessions: 15 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'training',
      title: 'Recall Training Session',
      description: 'Practiced recall with distractions at the park',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 30,
      successRate: 100,
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Earned Recall Master Badge',
      description: 'Perfect recall performance in challenging environment',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'training',
      title: 'Agility Practice',
      description: 'Worked on jumps and weave poles',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      duration: 45,
      successRate: 85,
    },
  ],
}

type TabType = 'overview' | 'progress' | 'activity' | 'achievements'

export function DogProfile() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isFollowing, setIsFollowing] = useState(false)

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-success-500'
    if (progress >= 70) return 'bg-primary-500'
    if (progress >= 50) return 'bg-warning-500'
    return 'bg-gray-400'
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Mastered': return 'bg-success-100 text-success-800 border-success-200'
      case 'Advanced': return 'bg-primary-100 text-primary-800 border-primary-200'
      case 'Intermediate': return 'bg-warning-100 text-warning-800 border-warning-200'
      case 'Learning': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cover Photo & Profile Header */}
      <Card className="dogstrava-card overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-r from-primary-400 to-primary-600">
          <img 
            src={mockDog.coverPhoto} 
            alt="Cover photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Dog Avatar */}
              <div className="relative -mt-16">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <img src={mockDog.avatar} alt={mockDog.name} className="w-full h-full object-cover" />
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-1.5 shadow-lg hover:bg-primary-600 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              {/* Dog Details */}
              <div className="mt-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{mockDog.name}</h1>
                  <Badge variant="outline" className="text-sm">
                    {mockDog.breed}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{mockDog.age} years old</span>
                  <span>•</span>
                  <span>{mockDog.weight} lbs</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{mockDog.location}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  {mockDog.bio}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="w-5 h-5">
                    <img src={mockDog.owner.avatar} alt={mockDog.owner.name} />
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    Owned by <span className="font-medium text-foreground">{mockDog.owner.name}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="dogstrava-button-primary"
              >
                <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{mockDog.stats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Training Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{mockDog.stats.commandsLearned}</div>
              <div className="text-sm text-muted-foreground">Commands Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">{mockDog.stats.achievements}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{mockDog.stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'progress', label: 'Training Progress' },
            { key: 'activity', label: 'Recent Activity' },
            { key: 'achievements', label: 'Achievements' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card className="dogstrava-card">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning-500" />
                  Recent Achievements
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {mockDog.recentAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {achievement.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(achievement.earnedDate)} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Command Progress Summary */}
            <Card className="dogstrava-card">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Training Progress
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {mockDog.commandProgress.slice(0, 4).map((command) => (
                  <div key={command.command} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{command.command}</span>
                      <Badge className={`text-xs ${getLevelBadgeColor(command.level)}`}>
                        {command.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(command.progress)}`}
                          style={{ width: `${command.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{command.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'progress' && (
          <Card className="dogstrava-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Command Training Progress</h3>
              <p className="text-sm text-muted-foreground">Track progress across all commands</p>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                {mockDog.commandProgress.map((command) => (
                  <div key={command.command} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{command.command}</h4>
                        <p className="text-sm text-muted-foreground">{command.sessions} sessions completed</p>
                      </div>
                      <Badge className={getLevelBadgeColor(command.level)}>
                        {command.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${getProgressColor(command.progress)}`}
                          style={{ width: `${command.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{command.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="dogstrava-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {mockDog.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'training' ? 'bg-primary-100' : 'bg-warning-100'
                    }`}>
                      {activity.type === 'training' ? (
                        <TrendingUp className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Award className="w-4 h-4 text-warning-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(activity.date)} ago</span>
                        {activity.duration && (
                          <>
                            <span>•</span>
                            <span>{activity.duration} min</span>
                          </>
                        )}
                        {activity.successRate && (
                          <>
                            <span>•</span>
                            <span className={activity.successRate >= 80 ? 'text-success-600' : 'text-warning-600'}>
                              {activity.successRate}% success
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'achievements' && (
          <Card className="dogstrava-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold">All Achievements</h3>
              <p className="text-sm text-muted-foreground">Milestones and badges earned</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDog.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {achievement.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Earned {formatDistanceToNow(achievement.earnedDate)} ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
