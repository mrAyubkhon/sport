import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { User as UserType } from '@/types';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : undefined,
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      age: user?.age || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
                {user?.age && (
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {user.age} years old
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and bio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age"
                      min="1"
                      max="150"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.age ? `${user.age} years old` : 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50 min-h-[100px]">
                      <span className="text-sm">
                        {user?.bio || 'No bio added yet'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>
                  Your activity and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Friends</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Goals Set</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
