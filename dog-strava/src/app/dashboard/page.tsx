'use client';

import { ProtectedRoute } from '@/features/auth/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Dog, Activity, Users, Shield } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button>New Training Session</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Dogs</CardTitle>
              <Dog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Training sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Other dog owners</p>
            </CardContent>
          </Card>
        </div>

        {/* Protected Route Demo */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Authentication Protection Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-green-700">
                🎉 <strong>Success!</strong> You're seeing this protected dashboard because you're authenticated.
              </p>
              
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Test the Protection:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open a new incognito/private browser window</li>
                  <li>Navigate to <code className="bg-gray-100 px-1 rounded">localhost:3000/dashboard</code></li>
                  <li>You'll be redirected to the login page automatically!</li>
                  <li>Same happens for <code className="bg-gray-100 px-1 rounded">/activity</code> and <code className="bg-gray-100 px-1 rounded">/dogs</code></li>
                </ol>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Mock Auth Credentials (while AWS activates):</h4>
                <div className="text-sm text-blue-700">
                  <p><strong>Email:</strong> test@dogstrava.com</p>
                  <p><strong>Password:</strong> password123</p>
                  <p><strong>Confirmation Code:</strong> 123456 (for registration testing)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Max - Sit Command</h4>
                  <p className="text-sm text-muted-foreground">Yesterday, 15 minutes</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">85%</div>
                  <div className="text-xs text-muted-foreground">Success rate</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Bella - Recall Training</h4>
                  <p className="text-sm text-muted-foreground">2 days ago, 20 minutes</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-yellow-600">72%</div>
                  <div className="text-xs text-muted-foreground">Success rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
