import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { LeaderboardData } from '@/types';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedPeriod, selectedType]);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiService.getLeaderboard({
        period: selectedPeriod,
        type: selectedType,
        page: 1,
        limit: 50,
      });
      setLeaderboardData(response.data.data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">
          {rank}
        </span>;
    }
  };

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const types = [
    { value: 'all', label: 'All Activities' },
    { value: 'running', label: 'Running' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'cycling', label: 'Cycling' },
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
                Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                See how you rank among your friends and the community
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {period.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.value)}
              >
                <Target className="w-4 h-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Your Rank */}
        {leaderboardData && leaderboardData.userRank > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(leaderboardData.userRank)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Your Rank</h3>
                    <p className="text-muted-foreground">
                      You are ranked #{leaderboardData.userRank} among your friends
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>
              Rankings based on total activity value for {periods.find(p => p.value === selectedPeriod)?.label.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardData && leaderboardData.leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboardData.leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                      entry.isCurrentUser 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium truncate">
                          {entry.user.name}
                        </h3>
                        {entry.isCurrentUser && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{entry.activityCount} activities</span>
                        {entry.totalDuration > 0 && (
                          <span>
                            {Math.floor(entry.totalDuration / 60)}h {entry.totalDuration % 60}m
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-primary">
                        {entry.totalValue.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        total units
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No data available</h3>
                <p className="text-muted-foreground">
                  {selectedType === 'all' 
                    ? 'No activities recorded for this period'
                    : `No ${selectedType} activities recorded for this period`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {leaderboardData && leaderboardData.leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaderboardData.leaderboard.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leaderboardData.leaderboard.reduce((sum, entry) => sum + entry.activityCount, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average per Person
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(leaderboardData.leaderboard.reduce((sum, entry) => sum + entry.totalValue, 0) / leaderboardData.leaderboard.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
