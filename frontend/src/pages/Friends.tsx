import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Users, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { Friend, SearchedUser } from '@/types';

const Friends: React.FC = () => {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'requests'>('friends');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await apiService.getFriends({ page: 1, limit: 50 });
      setFriends(response.data.data.data);
    } catch (error) {
      toast.error('Failed to load friends');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiService.searchUsers({ query, page: 1, limit: 20 });
      setSearchResults(response.data.data.data);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchTerm);
  };

  const sendFriendRequest = async (email: string) => {
    try {
      await apiService.sendFriendRequest({ receiverEmail: email });
      toast.success('Friend request sent!');
      searchUsers(searchTerm); // Refresh search results
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await apiService.removeFriend(friendId);
      toast.success('Friend removed');
      fetchFriends(); // Refresh friends list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove friend');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Friends
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Connect with other athletes and stay motivated together
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'friends', label: 'My Friends', icon: Users, count: friends.length },
            { id: 'search', label: 'Find Friends', icon: Search },
            { id: 'requests', label: 'Requests', icon: UserCheck },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-primary-foreground text-primary text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full card-hover">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{friend.name}</CardTitle>
                            <CardDescription>{friend.email}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {friend.bio && (
                            <p className="text-sm text-muted-foreground">{friend.bio}</p>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Friends since {new Date(friend.friendshipDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Profile
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFriend(friend.id)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start connecting with other athletes to share your journey
                  </p>
                  <Button onClick={() => setActiveTab('search')}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Find Friends</CardTitle>
                <CardDescription>
                  Search for other athletes by name or email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" loading={isSearching}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full card-hover">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {user.bio && (
                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {user.age && `${user.age} years old`}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.friendshipStatus === 'friends' 
                                ? 'bg-green-100 text-green-800' 
                                : user.friendshipStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.friendshipStatus}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={user.friendshipStatus === 'friends' || user.friendshipStatus === 'pending'}
                            onClick={() => sendFriendRequest(user.email)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {user.friendshipStatus === 'friends' 
                              ? 'Already Friends' 
                              : user.friendshipStatus === 'pending'
                              ? 'Request Sent'
                              : 'Send Request'
                            }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && !isSearching && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try searching with a different name or email
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="text-center py-12">
                <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Friend Requests</h3>
                <p className="text-muted-foreground">
                  Feature coming soon - manage your friend requests here
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Friends;
