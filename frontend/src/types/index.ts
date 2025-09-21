// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  age?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  age?: number;
  bio?: string;
}

export interface UpdateUserData {
  name?: string;
  age?: number;
  bio?: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Achievement types
export type AchievementType = 'running' | 'swimming' | 'cycling' | 'custom';

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  name?: string;
  value: number;
  unit: string;
  duration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateAchievementData {
  type: AchievementType;
  name?: string;
  value: number;
  unit: string;
  duration?: number;
  notes?: string;
}

export interface UpdateAchievementData extends Partial<CreateAchievementData> {}

export interface AchievementStats {
  byType: {
    type: AchievementType;
    _sum: {
      value: number | null;
      duration: number | null;
    };
    _count: {
      id: number;
    };
  }[];
  total: {
    _sum: {
      value: number | null;
      duration: number | null;
    };
    _count: {
      id: number;
    };
  };
  recent: Achievement[];
}

// Friend types
export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  age?: number;
  friendshipDate: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface SendFriendRequestData {
  receiverEmail: string;
}

export interface FriendRequestResponse {
  requestId: string;
  action: 'accept' | 'reject';
}

export interface SearchedUser extends User {
  friendshipStatus: 'friends' | 'pending' | 'rejected' | 'none';
}

// Notification types
export type NotificationType = 'FRIEND_REQUEST' | 'FRIEND_REQUEST_ACCEPTED' | 'NEW_ACHIEVEMENT' | 'ACHIEVEMENT_MILESTONE' | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    type: NotificationType;
    _count: {
      id: number;
    };
  }[];
}

// Leaderboard types
export interface LeaderboardEntry {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  totalValue: number;
  totalDuration: number;
  activityCount: number;
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  period: string;
  type: string;
  userRank: number;
}

// Socket types
export interface SocketNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Form types
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  text: string;
}

export interface UpdateTodoData {
  text?: string;
  completed?: boolean;
}

// Chart types
export interface ChartDataPoint {
  date: string;
  value: number;
  duration?: number;
}

export interface ChartData {
  running: ChartDataPoint[];
  swimming: ChartDataPoint[];
  cycling: ChartDataPoint[];
  custom: ChartDataPoint[];
}

// Error types
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Store types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeState {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface SocketState {
  connected: boolean;
  socket: any;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
