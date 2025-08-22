'use client'

import { useState } from 'react'
import { Plus, Filter, Calendar, Clock, Target, TrendingUp, Award, MapPin, Search } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { formatDistanceToNow, formatDuration } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// Mock training data
const mockTrainingSessions = [
  {
    id: '1',
    dog: {
      id: 'dog1',
      name: 'Max',
      avatar: '/api/placeholder/40/40',
      breed: 'Golden Retriever',
    },
    command: 'Recall',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 30,
    location: 'Central Park',
    notes: 'Excellent progress today! Max responded to recall even with squirrels nearby. Practiced at various distances up to 50 feet.',
    successRate: 95,
    repetitions: 20,
    distractions: ['Other dogs', 'Squirrels', 'People'],
    weather: 'Sunny, 72°F',
    mood: 'Energetic',
    treats: 'High-value chicken treats',
    achievements: ['First time perfect recall with squirrels present'],
    media: ['/api/placeholder/300/200'],
  },
  {
    id: '2',
    dog: {
      id: 'dog1',
      name: 'Max',
      avatar: '/api/placeholder/40/40',
      breed: 'Golden Retriever',
    },
    command: 'Stay',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 25,
    location: 'Backyard',
    notes: 'Worked on duration and distance. Max held a 3-minute stay while I walked around the yard. Still struggles when the neighbor\'s cat appears.',
    successRate: 80,
    repetitions: 15,
    distractions: ['Neighbor\'s cat', 'Delivery truck'],
    weather: 'Cloudy, 68°F',
    mood: 'Focused',
    treats: 'Training treats',
    achievements: [],
    media: [],
  },
  {
    id: '3',
    dog: {
      id: 'dog1',
      name: 'Max',
      avatar: '/api/placeholder/40/40',
      breed: 'Golden Retriever',
    },
    command: 'Heel',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 40,
    location: 'Neighborhood streets',
    notes: 'Practiced loose leash walking on busy streets. Max is getting much better at maintaining position. Need to work more on stopping when I stop.',
    successRate: 70,
    repetitions: 25,
    distractions: ['Cars', 'Other pedestrians', 'Bicycles'],
    weather: 'Light rain, 65°F',
    mood: 'Calm',
    treats: 'Cheese cubes',
    achievements: [],
    media: [],
  },
  {
    id: '4',
    dog: {
      id: 'dog2',
      name: 'Luna',
      avatar: '/api/placeholder/40/40',
      breed: 'Border Collie',
    },
    command: 'Agility Course',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 45,
    location: 'Dog Training Center',
    notes: 'First time attempting the full agility course! Luna loved the jumps and tunnel but was hesitant about the weave poles. Great energy and enthusiasm.',
    successRate: 85,
    repetitions: 8,
    distractions: ['Other dogs training', 'Equipment noise'],
    weather: 'Indoor',
    mood: 'Excited',
    treats: 'Freeze-dried liver',
    achievements: ['First complete agility course'],
    media: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
  },
]

const commands = ['All Commands', 'Recall', 'Stay', 'Sit', 'Down', 'Heel', 'Place', 'Agility', 'Tricks']
const timeFilters = ['All Time', 'This Week', 'This Month', 'Last 3 Months']

type FilterType = {
  command: string
  timeRange: string
  dog: string
}

export function TrainingLog() {
  const router = useRouter()
  const [sessions, setSessions] = useState(mockTrainingSessions)
  const [filters, setFilters] = useState<FilterType>({
    command: 'All Commands',
    timeRange: 'All Time',
    dog: 'All Dogs',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filteredSessions = sessions.filter(session => {
    const matchesCommand = filters.command === 'All Commands' || session.command === filters.command
    const matchesSearch = searchQuery === '' || 
      session.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCommand && matchesSearch
  })

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-success-600 bg-success-50'
    if (rate >= 70) return 'text-primary-600 bg-primary-50'
    if (rate >= 50) return 'text-warning-600 bg-warning-50'
    return 'text-red-600 bg-red-50'
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'energetic': return '⚡'
      case 'focused': return '🎯'
      case 'calm': return '😌'
      case 'excited': return '🤩'
      case 'tired': return '😴'
      default: return '🐕'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Log</h1>
          <p className="text-muted-foreground">Track and analyze your dog's training progress</p>
        </div>
        <Button className="dogstrava-button-primary" onClick={() => router.push('/training/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dogstrava-card">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="dogstrava-card">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Avg Success Rate</div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="dogstrava-card">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Clock className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">42h</div>
                <div className="text-sm text-muted-foreground">Total Training Time</div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="dogstrava-card">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-muted-foreground">Commands Learned</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="dogstrava-card">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions, commands, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dogstrava-input pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filters.command}
                onChange={(e) => setFilters(prev => ({ ...prev, command: e.target.value }))}
                className="dogstrava-input"
              >
                {commands.map(command => (
                  <option key={command} value={command}>{command}</option>
                ))}
              </select>

              <select
                value={filters.timeRange}
                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                className="dogstrava-input"
              >
                {timeFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Training Sessions */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="dogstrava-card">
            <div className="p-6">
              {/* Session Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <img src={session.dog.avatar} alt={session.dog.name} className="w-full h-full object-cover" />
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{session.command} Training</h3>
                      <Badge variant="outline">{session.dog.name}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(session.date)} ago</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Rate Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSuccessRateColor(session.successRate)}`}>
                  {session.successRate}% Success
                </div>
              </div>

              {/* Session Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notes */}
                <div className="lg:col-span-2">
                  <h4 className="font-medium mb-2">Session Notes</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{session.notes}</p>
                  
                  {session.achievements.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Award className="w-4 h-4 text-warning-500" />
                        Achievements
                      </h5>
                      <div className="space-y-1">
                        {session.achievements.map((achievement, index) => (
                          <div key={index} className="text-sm bg-warning-50 text-warning-800 px-2 py-1 rounded">
                            🏆 {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Metrics */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Session Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Repetitions:</span>
                        <span className="font-medium">{session.repetitions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weather:</span>
                        <span className="font-medium">{session.weather}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mood:</span>
                        <span className="font-medium">{getMoodEmoji(session.mood)} {session.mood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Treats:</span>
                        <span className="font-medium">{session.treats}</span>
                      </div>
                    </div>
                  </div>

                  {session.distractions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">Distractions</h5>
                      <div className="flex flex-wrap gap-1">
                        {session.distractions.map((distraction, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {distraction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Media */}
              {session.media.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium text-sm mb-2">Session Photos</h5>
                  <div className="flex gap-2">
                    {session.media.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Training session ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" className="dogstrava-button-secondary">
          Load More Sessions
        </Button>
      </div>
    </div>
  )
}
