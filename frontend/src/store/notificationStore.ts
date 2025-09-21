import { create } from 'zustand';
import { Notification, NotificationState } from '@/types';
import apiService from '@/services/api';
import socketService from '@/services/socket';

interface NotificationStore extends NotificationState {
  fetchNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  fetchStats: () => Promise<void>;
  setupSocketListeners: () => void;
  clearSocketListeners: () => void;
}

let socketUnsubscribers: (() => void)[] = [];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (params) => {
    set({ isLoading: true });
    try {
      const response = await apiService.getNotifications(params);
      const { data, pagination } = response.data.data;
      
      set({
        notifications: data,
        unreadCount: data.filter(n => !n.read).length,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      
      set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      
      set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await apiService.deleteNotification(notificationId);
      
      set((state) => {
        const notification = state.notifications.find(n => n.id === notificationId);
        const wasUnread = notification && !notification.read;
        
        return {
          notifications: state.notifications.filter(n => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error) {
      throw error;
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  fetchStats: async () => {
    try {
      const response = await apiService.getNotificationStats();
      const { unread } = response.data.data;
      
      set({ unreadCount: unread });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  },

  setupSocketListeners: () => {
    // Clear existing listeners
    get().clearSocketListeners();
    
    // Setup new listeners
    const unsubNotification = socketService.onNotification((notification) => {
      get().addNotification({
        id: notification.id,
        userId: '', // Will be set by the backend
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: false,
        data: notification.data,
        createdAt: notification.createdAt,
      });
    });

    socketUnsubscribers.push(unsubNotification);
  },

  clearSocketListeners: () => {
    socketUnsubscribers.forEach(unsubscribe => unsubscribe());
    socketUnsubscribers = [];
  },
}));
