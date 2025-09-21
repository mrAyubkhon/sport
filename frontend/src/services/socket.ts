import { io, Socket } from 'socket.io-client';
import { SocketNotification } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.isConnected = true;
        
        // Join user's personal room
        const userId = this.getUserIdFromToken(token);
        if (userId) {
          this.socket?.emit('join', userId);
        }
        
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      // Set up default event listeners
      this.setupEventListeners();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Handle notifications
    this.socket.on('notification', (notification: SocketNotification) => {
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('socket-notification', { detail: notification }));
    });

    // Handle friend requests
    this.socket.on('friendRequest', (request: any) => {
      window.dispatchEvent(new CustomEvent('socket-friend-request', { detail: request }));
    });

    // Handle friend acceptance
    this.socket.on('friendAccepted', (friend: any) => {
      window.dispatchEvent(new CustomEvent('socket-friend-accepted', { detail: friend }));
    });

    // Handle achievement updates
    this.socket.on('achievementUpdate', (achievement: any) => {
      window.dispatchEvent(new CustomEvent('socket-achievement-update', { detail: achievement }));
    });
  }

  // Event emitters
  sendFriendRequest(data: { receiverId: string; requestId: string }): void {
    this.socket?.emit('sendFriendRequest', data);
  }

  sendAchievementNotification(data: { achievementId: string; achievementType: string }): void {
    this.socket?.emit('newAchievement', data);
  }

  sendFriendAccepted(data: { friendId: string; requestId: string }): void {
    this.socket?.emit('friendAccepted', data);
  }

  // Utility methods
  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Event listeners for components
  onNotification(callback: (notification: SocketNotification) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('socket-notification', handler as EventListener);
    
    return () => {
      window.removeEventListener('socket-notification', handler as EventListener);
    };
  }

  onFriendRequest(callback: (request: any) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('socket-friend-request', handler as EventListener);
    
    return () => {
      window.removeEventListener('socket-friend-request', handler as EventListener);
    };
  }

  onFriendAccepted(callback: (friend: any) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('socket-friend-accepted', handler as EventListener);
    
    return () => {
      window.removeEventListener('socket-friend-accepted', handler as EventListener);
    };
  }

  onAchievementUpdate(callback: (achievement: any) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('socket-achievement-update', handler as EventListener);
    
    return () => {
      window.removeEventListener('socket-achievement-update', handler as EventListener);
    };
  }
}

export const socketService = new SocketService();
export default socketService;
