'use client'

import { useState } from 'react'
import { User, Bell, Shield, Palette, Database, LogOut, Camera, Mail, MapPin, Phone } from 'lucide-react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { ProtectedRoute } from '@/features/auth/components'
import { useAuthStore } from '@/stores'

// Mock user data
const mockUserSettings = {
  profile: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/80/80',
    bio: 'Dog lover and training enthusiast. Owner of Max, a Golden Retriever who loves learning new tricks!',
    accountType: 'owner' as const,
    joinedDate: new Date('2023-01-15'),
  },
  privacy: {
    profileVisibility: 'public' as 'public' | 'followers' | 'private',
    showLocation: true,
    showEmail: false,
    allowMessages: true,
    showTrainingStats: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    trainingReminders: true,
    socialUpdates: true,
    achievementAlerts: true,
    weeklyReports: false,
  },
  preferences: {
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'en',
    units: 'imperial' as 'metric' | 'imperial',
    autoSave: true,
  },
}

type SettingsTab = 'profile' | 'privacy' | 'notifications' | 'preferences' | 'data'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [settings, setSettings] = useState(mockUserSettings)
  const [isEditing, setIsEditing] = useState(false)
  const { logout } = useAuthStore()

  const handleSave = () => {
    // In real app, this would save to API
    setIsEditing(false)
    // Show success toast
    alert('Settings saved successfully!')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="dogstrava-card lg:col-span-1 h-fit">
            <div className="p-4">
              <nav className="space-y-1">
                {[
                  { key: 'profile', label: 'Profile', icon: User },
                  { key: 'privacy', label: 'Privacy', icon: Shield },
                  { key: 'notifications', label: 'Notifications', icon: Bell },
                  { key: 'preferences', label: 'Preferences', icon: Palette },
                  { key: 'data', label: 'Data & Storage', icon: Database },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <Card className="dogstrava-card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={isEditing ? "dogstrava-button-primary" : ""}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <img src={settings.profile.avatar} alt={settings.profile.name} className="w-full h-full object-cover" />
                        </Avatar>
                        {isEditing && (
                          <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary/80 transition-colors">
                            <Camera className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{settings.profile.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {settings.profile.accountType === 'owner' ? 'Dog Owner' : 'Rescue'}
                        </Badge>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, name: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="dogstrava-input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, email: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="dogstrava-input w-full pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="tel"
                            value={settings.profile.phone}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, phone: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="dogstrava-input w-full pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <input
                            type="text"
                            value={settings.profile.location}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, location: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="dogstrava-input w-full pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          profile: { ...prev.profile, bio: e.target.value }
                        }))}
                        disabled={!isEditing}
                        rows={4}
                        className="dogstrava-input w-full resize-none"
                        placeholder="Tell us about yourself and your dogs..."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <Card className="dogstrava-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, profileVisibility: e.target.value as any }
                        }))}
                        className="dogstrava-input w-full"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="followers">Followers Only - Only people you follow can see your profile</option>
                        <option value="private">Private - Only you can see your profile</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'showLocation', label: 'Show Location', description: 'Display your location on your profile' },
                        { key: 'showEmail', label: 'Show Email', description: 'Allow others to see your email address' },
                        { key: 'allowMessages', label: 'Allow Messages', description: 'Let other users send you direct messages' },
                        { key: 'showTrainingStats', label: 'Show Training Stats', description: 'Display your training statistics publicly' },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{label}</h4>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, [key]: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <Card className="dogstrava-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
                      { key: 'trainingReminders', label: 'Training Reminders', description: 'Get reminded about upcoming training sessions' },
                      { key: 'socialUpdates', label: 'Social Updates', description: 'Notifications about likes, comments, and follows' },
                      { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Get notified when you or your dogs earn achievements' },
                      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly training progress reports' },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{label}</h4>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[key as keyof typeof settings.notifications]}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, [key]: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <Card className="dogstrava-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">App Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select
                        value={settings.preferences.theme}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: e.target.value as any }
                        }))}
                        className="dogstrava-input w-full"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value }
                        }))}
                        className="dogstrava-input w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Units</label>
                      <select
                        value={settings.preferences.units}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, units: e.target.value as any }
                        }))}
                        className="dogstrava-input w-full"
                      >
                        <option value="imperial">Imperial (lbs, ft, °F)</option>
                        <option value="metric">Metric (kg, m, °C)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-save</h4>
                        <p className="text-sm text-muted-foreground">Automatically save your progress while training</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.autoSave}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, autoSave: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Data & Storage */}
            {activeTab === 'data' && (
              <Card className="dogstrava-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Data & Storage</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Export Data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all your training data, posts, and profile information
                      </p>
                      <Button variant="outline" className="dogstrava-button-secondary">
                        Export My Data
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Logout */}
            <Card className="dogstrava-card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">Sign out of your DogStrava account</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-secondary border-secondary hover:bg-secondary"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
