import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Target, Activity, Zap, Heart } from 'lucide-react';

const Welcome: React.FC = () => {
  const features = [
    {
      icon: Trophy,
      title: 'Track Achievements',
      description: 'Record your running, swimming, cycling, and custom activities with detailed metrics.',
    },
    {
      icon: Users,
      title: 'Connect with Friends',
      description: 'Find friends, send requests, and see their progress to stay motivated together.',
    },
    {
      icon: Target,
      title: 'Set Goals',
      description: 'Create personal goals and track your progress with beautiful charts and statistics.',
    },
    {
      icon: Activity,
      title: 'Real-time Updates',
      description: 'Get instant notifications when friends complete new achievements or send friend requests.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Activities Tracked', value: '50K+' },
    { label: 'Friends Connected', value: '25K+' },
    { label: 'Goals Achieved', value: '15K+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">SportAchievements</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-4"
          >
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Track Your{' '}
            <span className="text-gradient">Sport Achievements</span>{' '}
            with Friends
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of athletes who are tracking their fitness journey, 
            connecting with friends, and achieving their goals together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/register">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>

        {/* Hero Image/Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-4xl mx-auto mb-20"
        >
          <div className="glass-effect rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: 'Running', value: '5.2 km', duration: '28 min', icon: '🏃‍♂️' },
                { type: 'Swimming', value: '800 m', duration: '15 min', icon: '🏊‍♂️' },
                { type: 'Cycling', value: '12.5 km', duration: '45 min', icon: '🚴‍♂️' },
              ].map((activity, index) => (
                <motion.div
                  key={activity.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-3">{activity.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{activity.type}</h3>
                  <div className="text-2xl font-bold text-primary mb-1">{activity.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{activity.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Stay Motivated
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform provides all the tools you need to track your fitness journey and connect with like-minded people.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join our community of athletes and start tracking your achievements today. 
            It's free, it's fun, and it's motivating!
          </p>

          <Button size="lg" asChild className="text-lg px-12 py-6">
            <Link to="/register">Get Started Now</Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">SportAchievements</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 SportAchievements. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
