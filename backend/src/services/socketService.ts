import { Server as SocketIOServer } from 'socket.io';
import { Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Store connected users
const connectedUsers = new Map<string, string>(); // userId -> socketId

export const setupSocketHandlers = (io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyAccessToken(token);
      socket.data = {
        userId: decoded.userId,
        userEmail: decoded.email,
      };

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    const userEmail = socket.data.userEmail;

    console.log(`User ${userEmail} connected with socket ID: ${socket.id}`);

    // Store user connection
    connectedUsers.set(userId, socket.id);

    // Handle user joining their personal room
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their personal room`);
    });

    // Handle user leaving their personal room
    socket.on('leave', (userId: string) => {
      socket.leave(`user:${userId}`);
      console.log(`User ${userId} left their personal room`);
    });

    // Handle friend request notifications
    socket.on('sendFriendRequest', async (data) => {
      try {
        const { receiverId } = data;
        
        // Check if receiver is online
        const receiverSocketId = connectedUsers.get(receiverId);
        
        if (receiverSocketId) {
          // Get sender info
          const sender = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, avatar: true },
          });

          if (sender) {
            io.to(`user:${receiverId}`).emit('friendRequest', {
              id: data.requestId,
              type: 'FRIEND_REQUEST',
              title: 'New Friend Request',
              message: `${sender.name} wants to be your friend!`,
              data: {
                requestId: data.requestId,
                senderId: userId,
                senderName: sender.name,
                senderAvatar: sender.avatar,
              },
              createdAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error('Error sending friend request notification:', error);
      }
    });

    // Handle achievement notifications
    socket.on('newAchievement', async (data) => {
      try {
        const { achievementId, achievementType } = data;
        
        // Get user's friends
        const friendships = await prisma.friendship.findMany({
          where: {
            OR: [
              { user1Id: userId },
              { user2Id: userId },
            ],
          },
        });

        const friendIds = friendships.map(friendship => 
          friendship.user1Id === userId ? friendship.user2Id : friendship.user1Id
        );

        // Get user info
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, avatar: true },
        });

        if (user && friendIds.length > 0) {
          // Notify all online friends
          friendIds.forEach(friendId => {
            const friendSocketId = connectedUsers.get(friendId);
            if (friendSocketId) {
              io.to(`user:${friendId}`).emit('achievementUpdate', {
                id: achievementId,
                type: 'NEW_ACHIEVEMENT',
                title: 'New Achievement!',
                message: `${user.name} just completed a ${achievementType} activity!`,
                data: {
                  achievementId,
                  friendId: userId,
                  friendName: user.name,
                  friendAvatar: user.avatar,
                  achievementType,
                },
                createdAt: new Date(),
              });
            }
          });
        }
      } catch (error) {
        console.error('Error sending achievement notification:', error);
      }
    });

    // Handle friend acceptance notifications
    socket.on('friendAccepted', async (data) => {
      try {
        const { friendId } = data;
        
        // Check if friend is online
        const friendSocketId = connectedUsers.get(friendId);
        
        if (friendSocketId) {
          // Get user info
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, avatar: true },
          });

          if (user) {
            io.to(`user:${friendId}`).emit('friendAccepted', {
              id: data.requestId,
              type: 'FRIEND_REQUEST_ACCEPTED',
              title: 'Friend Request Accepted',
              message: `${user.name} accepted your friend request!`,
              data: {
                friendId: userId,
                friendName: user.name,
                friendAvatar: user.avatar,
              },
              createdAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error('Error sending friend acceptance notification:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userEmail} disconnected`);
      connectedUsers.delete(userId);
    });
  });
};

// Helper function to send notification to specific user
export const sendNotificationToUser = async (io: SocketIOServer, userId: string, notification: any) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId);
};
