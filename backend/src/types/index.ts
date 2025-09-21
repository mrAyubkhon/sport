export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Achievement types
export type AchievementType = 'running' | 'swimming' | 'cycling' | 'custom';

export interface CreateAchievementData {
  type: AchievementType;
  name?: string;
  value: number;
  unit: string;
  duration?: number;
  notes?: string;
}

export interface UpdateAchievementData extends Partial<CreateAchievementData> {}

// User types
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  bio?: string;
}

export interface UpdateUserData {
  name?: string;
  age?: number;
  weight?: number;
  height?: number;
  bio?: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Friend types
export interface SendFriendRequestData {
  receiverEmail: string;
}

export interface FriendRequestResponse {
  requestId: string;
  action: 'accept' | 'reject';
}

// Notification types
export interface CreateNotificationData {
  userId: string;
  type: 'FRIEND_REQUEST' | 'FRIEND_REQUEST_ACCEPTED' | 'NEW_ACHIEVEMENT' | 'ACHIEVEMENT_MILESTONE' | 'GENERAL';
  title: string;
  message: string;
  data?: any;
}

// Socket.io types
export interface SocketData {
  userId: string;
  userEmail: string;
}

export interface ServerToClientEvents {
  notification: (notification: any) => void;
  friendRequest: (request: any) => void;
  friendAccepted: (friend: any) => void;
  achievementUpdate: (achievement: any) => void;
}

export interface ClientToServerEvents {
  join: (userId: string) => void;
  leave: (userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export type SocketType = import('socket.io').Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
