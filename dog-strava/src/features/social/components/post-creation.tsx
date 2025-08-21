'use client'

import { useState } from 'react'
import { Camera, Video, MapPin, Trophy, Target, X, Plus, Smile, Hash, AtSign } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'

// Mock data
const mockUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  avatar: '/api/placeholder/40/40',
  accountType: 'owner' as const,
}

const mockDogs = [
  { id: 'dog1', name: 'Max', avatar: '/api/placeholder/30/30', breed: 'Golden Retriever' },
  { id: 'dog2', name: 'Luna', avatar: '/api/placeholder/30/30', breed: 'Border Collie' },
]

const commandSuggestions = [
  'Sit', 'Stay', 'Down', 'Recall', 'Heel', 'Place', 'Leave it', 'Drop it', 'Wait', 'Touch'
]

const locationSuggestions = [
  'Central Park', 'Backyard', 'Dog Training Center', 'Beach', 'Local Park', 'Neighborhood'
]

type PostType = 'general' | 'training' | 'achievement'

type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  file?: File
}

type TrainingData = {
  command: string
  duration: number
  successRate: number
  location: string
  repetitions: number
  notes: string
}

type AchievementData = {
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  commands: string[]
}

export function PostCreation() {
  const [postType, setPostType] = useState<PostType>('general')
  const [selectedDog, setSelectedDog] = useState(mockDogs[0])
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Training specific state
  const [trainingData, setTrainingData] = useState<TrainingData>({
    command: '',
    duration: 0,
    successRate: 0,
    location: '',
    repetitions: 0,
    notes: '',
  })

  // Achievement specific state
  const [achievementData, setAchievementData] = useState<AchievementData>({
    title: '',
    description: '',
    level: 'Beginner',
    commands: [],
  })

  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const mediaItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        file,
      }
      setMedia(prev => [...prev, mediaItem])
    })
  }

  const removeMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id))
  }

  const addCommand = (command: string) => {
    if (!achievementData.commands.includes(command)) {
      setAchievementData(prev => ({
        ...prev,
        commands: [...prev.commands, command]
      }))
    }
  }

  const removeCommand = (command: string) => {
    setAchievementData(prev => ({
      ...prev,
      commands: prev.commands.filter(c => c !== command)
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setContent('')
    setMedia([])
    setTrainingData({
      command: '',
      duration: 0,
      successRate: 0,
      location: '',
      repetitions: 0,
      notes: '',
    })
    setAchievementData({
      title: '',
      description: '',
      level: 'Beginner',
      commands: [],
    })
    setPostType('general')
    setIsSubmitting(false)
    
    // Show success message (in real app, this would be a toast notification)
    alert('Post created successfully!')
  }

  const isFormValid = () => {
    if (!content.trim()) return false
    
    if (postType === 'training') {
      return trainingData.command && trainingData.duration > 0
    }
    
    if (postType === 'achievement') {
      return achievementData.title && achievementData.description
    }
    
    return true
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="dogstrava-card">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
            </Avatar>
            <div>
              <h3 className="font-semibold">{mockUser.name}</h3>
              <p className="text-sm text-muted-foreground">Create a new post</p>
            </div>
          </div>
        </div>

        {/* Post Type Selection */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setPostType('general')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                postType === 'general'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Smile className="w-4 h-4" />
              General Post
            </button>
            <button
              onClick={() => setPostType('training')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                postType === 'training'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              Training Session
            </button>
            <button
              onClick={() => setPostType('achievement')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                postType === 'achievement'
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Achievement
            </button>
          </div>
        </div>

        {/* Dog Selection */}
        <div className="p-4 border-b">
          <label className="block text-sm font-medium mb-2">Select Dog</label>
          <div className="flex gap-2">
            {mockDogs.map((dog) => (
              <button
                key={dog.id}
                onClick={() => setSelectedDog(dog)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedDog.id === dog.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Avatar className="w-6 h-6">
                  <img src={dog.avatar} alt={dog.name} className="w-full h-full object-cover" />
                </Avatar>
                <span className="text-sm font-medium">{dog.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'general' 
                ? `What's ${selectedDog.name} up to today?`
                : postType === 'training'
                ? `Tell us about ${selectedDog.name}'s training session...`
                : `Share ${selectedDog.name}'s latest achievement!`
            }
            className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Training Session Details */}
        {postType === 'training' && (
          <div className="p-4 border-t bg-gray-50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" />
              Training Session Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Command</label>
                <input
                  type="text"
                  value={trainingData.command}
                  onChange={(e) => {
                    setTrainingData(prev => ({ ...prev, command: e.target.value }))
                    setShowCommandSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowCommandSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCommandSuggestions(false), 200)}
                  placeholder="e.g., Sit, Stay, Recall"
                  className="dogstrava-input w-full"
                />
                {showCommandSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    {commandSuggestions
                      .filter(cmd => cmd.toLowerCase().includes(trainingData.command.toLowerCase()))
                      .map((command) => (
                        <button
                          key={command}
                          onClick={() => {
                            setTrainingData(prev => ({ ...prev, command }))
                            setShowCommandSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {command}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={trainingData.duration || ''}
                  onChange={(e) => setTrainingData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="30"
                  className="dogstrava-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Success Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={trainingData.successRate || ''}
                  onChange={(e) => setTrainingData(prev => ({ ...prev, successRate: parseInt(e.target.value) || 0 }))}
                  placeholder="85"
                  className="dogstrava-input w-full"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={trainingData.location}
                  onChange={(e) => {
                    setTrainingData(prev => ({ ...prev, location: e.target.value }))
                    setShowLocationSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  placeholder="Where did you train?"
                  className="dogstrava-input w-full"
                />
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    {locationSuggestions
                      .filter(loc => loc.toLowerCase().includes(trainingData.location.toLowerCase()))
                      .map((location) => (
                        <button
                          key={location}
                          onClick={() => {
                            setTrainingData(prev => ({ ...prev, location }))
                            setShowLocationSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {location}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Repetitions</label>
                <input
                  type="number"
                  value={trainingData.repetitions || ''}
                  onChange={(e) => setTrainingData(prev => ({ ...prev, repetitions: parseInt(e.target.value) || 0 }))}
                  placeholder="How many times did you practice?"
                  className="dogstrava-input w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Achievement Details */}
        {postType === 'achievement' && (
          <div className="p-4 border-t bg-gradient-to-r from-warning-50 to-primary-50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning-500" />
              Achievement Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Achievement Title</label>
                <input
                  type="text"
                  value={achievementData.title}
                  onChange={(e) => setAchievementData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Recall Master, Basic Obedience Graduate"
                  className="dogstrava-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={achievementData.description}
                  onChange={(e) => setAchievementData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your dog accomplished..."
                  className="dogstrava-input w-full h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  value={achievementData.level}
                  onChange={(e) => setAchievementData(prev => ({ ...prev, level: e.target.value as any }))}
                  className="dogstrava-input w-full"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Commands Involved</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {achievementData.commands.map((command) => (
                    <Badge
                      key={command}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {command}
                      <button
                        onClick={() => removeCommand(command)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {commandSuggestions
                    .filter(cmd => !achievementData.commands.includes(cmd))
                    .slice(0, 6)
                    .map((command) => (
                      <button
                        key={command}
                        onClick={() => addCommand(command)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        + {command}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Upload */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Add Photos or Videos</h4>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                  <Camera className="w-4 h-4" />
                  Photo
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                  <Video className="w-4 h-4" />
                  Video
                </div>
              </label>
            </div>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {media.map((item) => (
                <div key={item.id} className="relative group">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt="Upload preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{content.length}/500 characters</span>
            {media.length > 0 && <span>{media.length} media files</span>}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setContent('')
              setMedia([])
              setPostType('general')
            }}>
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="dogstrava-button-primary"
            >
              {isSubmitting ? 'Posting...' : 'Share Post'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
