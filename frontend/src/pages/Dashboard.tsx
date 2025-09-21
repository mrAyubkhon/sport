import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Target, 
  Activity, 
  TrendingUp, 
  Calendar,
  Plus,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useThemeStore } from '@/store/themeStore';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { Achievement, AchievementStats } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { toggleTheme } = useThemeStore();
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, achievementsResponse] = await Promise.all([
          apiService.getAchievementStats(),
          apiService.getAchievements({ page: 1, limit: 5 }),
        ]);

        setStats(statsResponse.data.data);
        setRecentAchievements(achievementsResponse.data.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add Achievement',
      description: 'Record a new activity',
      icon: Plus,
      href: '/achievements?action=add',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Find Friends',
      description: 'Connect with other athletes',
      icon: Users,
      href: '/friends?action=search',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'View Leaderboard',
      description: 'See how you rank',
      icon: Trophy,
      href: '/leaderboard',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      title: 'Set Goals',
      description: 'Create personal targets',
      icon: Target,
      href: '/achievements?action=goals',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const achievementTypes = [
    { type: 'running', label: 'Running', icon: '🏃‍♂️', color: 'text-green-600' },
    { type: 'swimming', label: 'Swimming', icon: '🏊‍♂️', color: 'text-blue-600' },
    { type: 'cycling', label: 'Cycling', icon: '🚴‍♂️', color: 'text-orange-600' },
    { type: 'custom', label: 'Custom', icon: '💪', color: 'text-purple-600' },
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ready to achieve your fitness goals today?
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total._count.id || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.total._sum.value?.toFixed(1) || 0} total units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor((stats?.total._sum.duration || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                {(stats?.total._sum.duration || 0) % 60}m total time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.recent.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Connected athletes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      asChild
                    >
                      <a href={action.href}>
                        <action.icon className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>
                  Your latest activities and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => {
                      const typeInfo = achievementTypes.find(t => t.type === achievement.type);
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="text-2xl">{typeInfo?.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">
                                {achievement.type === 'custom' ? achievement.name : typeInfo?.label}
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                {new Date(achievement.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`font-semibold ${typeInfo?.color}`}>
                                {achievement.value} {achievement.unit}
                              </span>
                              {achievement.duration && (
                                <span className="text-sm text-muted-foreground">
                                  {Math.floor(achievement.duration / 60)}h {achievement.duration % 60}m
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your activities to see them here
                    </p>
                    <Button asChild>
                      <a href="/achievements?action=add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Achievement
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Breakdown */}
        {stats && stats.byType.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>
                  Your activities by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.byType.map((typeStat, index) => {
                    const typeInfo = achievementTypes.find(t => t.type === typeStat.type);
                    return (
                      <motion.div
                        key={typeStat.type}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        className="p-4 border rounded-lg text-center"
                      >
                        <div className="text-3xl mb-2">{typeInfo?.icon}</div>
                        <h3 className="font-medium mb-1">{typeInfo?.label}</h3>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {typeStat._count.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {typeStat._sum.value?.toFixed(1) || 0} {typeStat.type === 'running' || typeStat.type === 'cycling' ? 'km' : 'units'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
