import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Trophy, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { Achievement, AchievementStats } from '@/types';

const Achievements: React.FC = () => {
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, [filterType]);

  const fetchAchievements = async () => {
    try {
      const params: any = { page: 1, limit: 20 };
      if (filterType !== 'all') {
        params.type = filterType;
      }
      
      const response = await apiService.getAchievements(params);
      setAchievements(response.data.data.data);
    } catch (error) {
      toast.error('Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getAchievementStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const achievementTypes = [
    { type: 'running', label: 'Running', icon: '🏃‍♂️', color: 'text-green-600 bg-green-100' },
    { type: 'swimming', label: 'Swimming', icon: '🏊‍♂️', color: 'text-blue-600 bg-blue-100' },
    { type: 'cycling', label: 'Cycling', icon: '🚴‍♂️', color: 'text-orange-600 bg-orange-100' },
    { type: 'custom', label: 'Custom', icon: '💪', color: 'text-purple-600 bg-purple-100' },
  ];

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
                My Achievements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your fitness journey and celebrate your progress
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total._count.id}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total._sum.value?.toFixed(1) || 0} total units
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor((stats.total._sum.duration || 0) / 60)}h
                </div>
                <p className="text-xs text-muted-foreground">
                  {(stats.total._sum.duration || 0) % 60}m total time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recent.length}</div>
                <p className="text-xs text-muted-foreground">
                  Recent activities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average per Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((stats.total._count.id || 0) / 4)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Activities per week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {achievementTypes.map((type) => (
              <Button
                key={type.type}
                variant={filterType === type.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(filterType === type.type ? 'all' : type.type)}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Achievements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement, index) => {
              const typeInfo = achievementTypes.find(t => t.type === achievement.type);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo?.color}`}>
                            <span className="text-lg">{typeInfo?.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {achievement.type === 'custom' ? achievement.name : typeInfo?.label}
                            </CardTitle>
                            <CardDescription>
                              {new Date(achievement.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            {achievement.value}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {achievement.unit}
                          </span>
                        </div>
                        
                        {achievement.duration && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {Math.floor(achievement.duration / 60)}h {achievement.duration % 60}m
                            </span>
                          </div>
                        )}
                        
                        {achievement.notes && (
                          <p className="text-sm text-muted-foreground">
                            {achievement.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No achievements found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start tracking your activities to see them here'
                    }
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Achievement
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
