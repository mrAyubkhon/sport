import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  User,
  Achievement,
  CreateAchievementData,
  UpdateAchievementData,
  AchievementStats,
  Friend,
  FriendRequest,
  SendFriendRequestData,
  FriendRequestResponse,
  SearchedUser,
  Notification,
  NotificationStats,
  LeaderboardData,
  CreateUserData,
  UpdateUserData,
  LoginData,
  PaginatedResponse,
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data.data;
              
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: CreateUserData): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
    return this.api.post('/auth/register', data);
  }

  async login(data: LoginData): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
    return this.api.post('/auth/login', data);
  }

  async logout(): Promise<AxiosResponse<ApiResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.api.post('/auth/logout', { refreshToken });
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<ApiResponse<{ accessToken: string; refreshToken: string }>>> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  async getProfile(): Promise<AxiosResponse<ApiResponse<User>>> {
    return this.api.get('/auth/profile');
  }

  // User endpoints
  async updateProfile(data: UpdateUserData): Promise<AxiosResponse<ApiResponse<User>>> {
    return this.api.put('/users/profile', data);
  }

  async getUserProfile(userId: string): Promise<AxiosResponse<ApiResponse<User & { friendshipStatus: string; recentAchievements: Achievement[]; achievementStats: any }>>> {
    return this.api.get(`/users/${userId}`);
  }

  async getLeaderboard(params?: { type?: string; period?: string; page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<LeaderboardData>>> {
    return this.api.get('/users/leaderboard', { params });
  }

  async deleteAccount(password: string): Promise<AxiosResponse<ApiResponse>> {
    return this.api.delete('/users/account', { data: { password } });
  }

  // Achievement endpoints
  async createAchievement(data: CreateAchievementData): Promise<AxiosResponse<ApiResponse<Achievement>>> {
    return this.api.post('/achievements', data);
  }

  async getAchievements(params?: { page?: number; limit?: number; type?: string; sortBy?: string; sortOrder?: string }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Achievement>>>> {
    return this.api.get('/achievements', { params });
  }

  async getAchievementById(id: string): Promise<AxiosResponse<ApiResponse<Achievement>>> {
    return this.api.get(`/achievements/${id}`);
  }

  async updateAchievement(id: string, data: UpdateAchievementData): Promise<AxiosResponse<ApiResponse<Achievement>>> {
    return this.api.put(`/achievements/${id}`, data);
  }

  async deleteAchievement(id: string): Promise<AxiosResponse<ApiResponse>> {
    return this.api.delete(`/achievements/${id}`);
  }

  async getAchievementStats(): Promise<AxiosResponse<ApiResponse<AchievementStats>>> {
    return this.api.get('/achievements/stats');
  }

  async getFriendsAchievements(params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Achievement>>>> {
    return this.api.get('/achievements/friends', { params });
  }

  // Friend endpoints
  async searchUsers(params?: { query?: string; page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<SearchedUser>>>> {
    return this.api.get('/friends/search', { params });
  }

  async sendFriendRequest(data: SendFriendRequestData): Promise<AxiosResponse<ApiResponse<FriendRequest>>> {
    return this.api.post('/friends/request', data);
  }

  async respondToFriendRequest(data: FriendRequestResponse): Promise<AxiosResponse<ApiResponse>> {
    return this.api.post('/friends/request/respond', data);
  }

  async getFriendRequests(params?: { type?: string; page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<FriendRequest>>>> {
    return this.api.get('/friends/requests', { params });
  }

  async getFriends(params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Friend>>>> {
    return this.api.get('/friends', { params });
  }

  async removeFriend(friendId: string): Promise<AxiosResponse<ApiResponse>> {
    return this.api.delete(`/friends/${friendId}`);
  }

  // Notification endpoints
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Notification>>>> {
    return this.api.get('/notifications', { params });
  }

  async markNotificationAsRead(notificationId: string): Promise<AxiosResponse<ApiResponse<Notification>>> {
    return this.api.patch(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<AxiosResponse<ApiResponse<{ updatedCount: number }>>> {
    return this.api.patch('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<AxiosResponse<ApiResponse>> {
    return this.api.delete(`/notifications/${notificationId}`);
  }

  async getNotificationStats(): Promise<AxiosResponse<ApiResponse<NotificationStats>>> {
    return this.api.get('/notifications/stats');
  }
}

export const apiService = new ApiService();
export default apiService;
