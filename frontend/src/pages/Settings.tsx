import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Monitor, LogOut, Trash2, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = () => {
    // This would typically open a confirmation dialog
    toast.error('Account deletion feature coming soon');
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const settingsSections = [
    {
      title: 'Appearance',
      description: 'Customize the look and feel of the app',
      icon: SettingsIcon,
      items: [
        {
          title: 'Theme',
          description: 'Choose your preferred theme',
          component: (
            <div className="flex space-x-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={theme === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(option.value as any)}
                  className="flex items-center space-x-2"
                >
                  <option.icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      items: [
        {
          title: 'Push Notifications',
          description: 'Receive notifications about friend activities',
          component: (
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          ),
        },
        {
          title: 'Email Notifications',
          description: 'Receive email updates about your account',
          component: (
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your privacy and security settings',
      icon: Shield,
      items: [
        {
          title: 'Profile Visibility',
          description: 'Control who can see your profile and activities',
          component: (
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          ),
        },
        {
          title: 'Data Export',
          description: 'Download your data in a portable format',
          component: (
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className="flex items-center justify-between py-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="ml-4">
                        {item.component}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    loading={isLoggingOut}
                    className="ml-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
