'use client'

import { useState } from 'react'
import { Search, UserPlus, UserCheck, MapPin, Award } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { ProtectedRoute } from '@/features/auth/components'

// Mock data for following/followers
const mockUsers = [
  {
    id: 'user1',
    name: 'Mike Chen',
    avatar: '/api/placeholder/50/50',
    accountType: 'owner' as const,
    location: 'San Francisco, CA',
    dogs: [
      { name: 'Bella', breed: 'German Shepherd', avatar: '/api/placeholder/30/30' }
    ],
    stats: {
      followers: 234,
      following: 189,
      posts: 127,
      achievements: 15,
    },
    isFollowing: true,
    mutualFollowers: 8,
  },
  {
    id: 'user2',
    name: 'Happy Tails Rescue',
    avatar: '/api/placeholder/50/50',
    accountType: 'rescue' as const,
    location: 'Oakland, CA',
    dogs: [
      { name: 'Luna', breed: 'Border Collie Mix', avatar: '/api/placeholder/30/30' },
      { name: 'Rocky', breed: 'Pit Bull Mix', avatar: '/api/placeholder/30/30' },
    ],
    stats: {
      followers: 1240,
      following: 45,
      posts: 340,
      achievements: 28,
    },
    isFollowing: true,
    mutualFollowers: 15,
  },
  {
    id: 'user3',
    name: 'Emma Rodriguez',
    avatar: '/api/placeholder/50/50',
    accountType: 'owner' as const,
    location: 'Los Angeles, CA',
    dogs: [
      { name: 'Charlie', breed: 'Labrador', avatar: '/api/placeholder/30/30' }
    ],
    stats: {
      followers: 89,
      following: 156,
      posts: 67,
      achievements: 8,
    },
    isFollowing: false,
    mutualFollowers: 3,
  },
  {
    id: 'user4',
    name: 'Professional K9 Training',
    avatar: '/api/placeholder/50/50',
    accountType: 'trainer' as const,
    location: 'San Jose, CA',
    dogs: [],
    stats: {
      followers: 2100,
      following: 234,
      posts: 890,
      achievements: 45,
    },
    isFollowing: false,
    mutualFollowers: 22,
  },
]

type TabType = 'following' | 'followers' | 'discover'

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('following')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState(mockUsers)

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !user.isFollowing,
            stats: {
              ...user.stats,
              followers: user.isFollowing ? user.stats.followers - 1 : user.stats.followers + 1
            }
          }
        : user
    ))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.dogs.some(dog => dog.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dog.breed.toLowerCase().includes(searchQuery.toLowerCase()))
    
    switch (activeTab) {
      case 'following':
        return user.isFollowing && matchesSearch
      case 'followers':
        return matchesSearch // In real app, this would be actual followers
      case 'discover':
        return !user.isFollowing && matchesSearch
      default:
        return matchesSearch
    }
  })

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with other dog owners, trainers, and rescues
          </p>
        </div>

        {/* Search */}
        <div className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, dogs, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dogstrava-input pl-10 w-full"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 pb-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { key: 'following', label: 'Following', count: users.filter(u => u.isFollowing).length },
              { key: 'followers', label: 'Followers', count: 45 }, // Mock count
              { key: 'discover', label: 'Discover', count: users.filter(u => !u.isFollowing).length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="space-y-4 pt-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="dogstrava-card">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="w-16 h-16">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge 
                          variant={user.accountType === 'rescue' ? 'secondary' : user.accountType === 'trainer' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {user.accountType === 'rescue' ? 'Rescue' : user.accountType === 'trainer' ? 'Trainer' : 'Owner'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>

                      {/* Dogs */}
                      {user.dogs.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-muted-foreground">Dogs:</span>
                          <div className="flex items-center gap-2">
                            {user.dogs.slice(0, 3).map((dog, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <Avatar className="w-5 h-5">
                                  <img src={dog.avatar} alt={dog.name} className="w-full h-full object-cover" />
                                </Avatar>
                                <span className="text-sm font-medium">{dog.name}</span>
                                <span className="text-xs text-muted-foreground">({dog.breed})</span>
                              </div>
                            ))}
                            {user.dogs.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{user.dogs.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="font-medium">{user.stats.followers}</span>
                          <span className="text-muted-foreground ml-1">followers</span>
                        </div>
                        <div>
                          <span className="font-medium">{user.stats.following}</span>
                          <span className="text-muted-foreground ml-1">following</span>
                        </div>
                        <div>
                          <span className="font-medium">{user.stats.posts}</span>
                          <span className="text-muted-foreground ml-1">posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-warning-500" />
                          <span className="font-medium">{user.stats.achievements}</span>
                          <span className="text-muted-foreground ml-1">achievements</span>
                        </div>
                      </div>

                      {/* Mutual Followers */}
                      {user.mutualFollowers > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Followed by {user.mutualFollowers} people you follow
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Follow Button */}
                  <Button
                    variant={user.isFollowing ? "secondary" : "default"}
                    onClick={() => handleFollow(user.id)}
                    className={user.isFollowing ? "dogstrava-button-secondary" : "dogstrava-button-primary"}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="dogstrava-card">
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🐕</div>
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No users match "${searchQuery}"`
                  : activeTab === 'following'
                  ? "You're not following anyone yet"
                  : activeTab === 'followers'
                  ? "No followers yet"
                  : "No users to discover"
                }
              </p>
            </div>
          </Card>
        )}

        {/* Load More */}
        {filteredUsers.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" className="dogstrava-button-secondary">
              Load More Users
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
