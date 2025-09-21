import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, SendFriendRequestData, FriendRequestResponse } from '../types';

const prisma = new PrismaClient();

export const searchUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { query, page = 1, limit = 10 } = req.query;
  const currentUserId = req.user!.id;

  if (!query || typeof query !== 'string') {
    throw createError('Search query is required', 400);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        { id: { not: currentUserId } }, // Exclude current user
      ],
    },
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      age: true,
    },
  });

  // Check friendship status for each user
  const usersWithStatus = await Promise.all(
    users.map(async (user) => {
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: currentUserId, user2Id: user.id },
            { user1Id: user.id, user2Id: currentUserId },
          ],
        },
      });

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: user.id },
            { senderId: user.id, receiverId: currentUserId },
          ],
        },
      });

      return {
        ...user,
        friendshipStatus: friendship ? 'friends' : friendRequest ? friendRequest.status.toLowerCase() : 'none',
      };
    })
  );

  const total = await prisma.user.count({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        { id: { not: currentUserId } },
      ],
    },
  });

  sendPaginatedSuccess(res, usersWithStatus, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, 'Users found successfully');
});

export const sendFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const senderId = req.user!.id;
  const { receiverEmail }: SendFriendRequestData = req.body;

  // Find receiver by email
  const receiver = await prisma.user.findUnique({
    where: { email: receiverEmail },
  });

  if (!receiver) {
    throw createError('User not found', 404);
  }

  if (receiver.id === senderId) {
    throw createError('Cannot send friend request to yourself', 400);
  }

  // Check if already friends
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: receiver.id },
        { user1Id: receiver.id, user2Id: senderId },
      ],
    },
  });

  if (existingFriendship) {
    throw createError('You are already friends with this user', 400);
  }

  // Check if friend request already exists
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    throw createError('Friend request already exists', 400);
  }

  // Create friend request
  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId: receiver.id,
      status: 'PENDING',
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: receiver.id,
      type: 'FRIEND_REQUEST',
      title: 'New Friend Request',
      message: `${req.user!.name} wants to be your friend!`,
      data: {
        requestId: friendRequest.id,
        senderId,
        senderName: req.user!.name,
      },
    },
  });

  sendSuccess(res, friendRequest, 'Friend request sent successfully', 201);
});

export const respondToFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { requestId, action }: FriendRequestResponse = req.body;

  // Find friend request
  const friendRequest = await prisma.friendRequest.findFirst({
    where: {
      id: requestId,
      receiverId: userId,
      status: 'PENDING',
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!friendRequest) {
    throw createError('Friend request not found', 404);
  }

  if (action === 'accept') {
    // Create friendship
    await prisma.friendship.create({
      data: {
        user1Id: friendRequest.senderId,
        user2Id: userId,
      },
    });

    // Update friend request status
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    // Create notification for sender
    await prisma.notification.create({
      data: {
        userId: friendRequest.senderId,
        type: 'FRIEND_REQUEST_ACCEPTED',
        title: 'Friend Request Accepted',
        message: `${req.user!.name} accepted your friend request!`,
        data: {
          friendId: userId,
          friendName: req.user!.name,
        },
      },
    });

    sendSuccess(res, { message: 'Friend request accepted', friendship: true }, 'Friend request accepted successfully');
  } else if (action === 'reject') {
    // Update friend request status
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    sendSuccess(res, { message: 'Friend request rejected' }, 'Friend request rejected successfully');
  } else {
    throw createError('Invalid action. Use "accept" or "reject"', 400);
  }
});

export const getFriendRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { type = 'received', page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};
  if (type === 'sent') {
    where.senderId = userId;
  } else {
    where.receiverId = userId;
  }

  const [requests, total] = await Promise.all([
    prisma.friendRequest.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.friendRequest.count({ where }),
  ]);

  sendPaginatedSuccess(res, requests, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, `${type} friend requests retrieved successfully`);
});

export const getFriends = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [friendships, total] = await Promise.all([
    prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            age: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            age: true,
          },
        },
      },
    }),
    prisma.friendship.count({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
    }),
  ]);

  // Transform friendships to get friend data
  const friends = friendships.map(friendship => ({
    id: friendship.user1Id === userId ? friendship.user2.id : friendship.user1.id,
    name: friendship.user1Id === userId ? friendship.user2.name : friendship.user1.name,
    email: friendship.user1Id === userId ? friendship.user2.email : friendship.user1.email,
    avatar: friendship.user1Id === userId ? friendship.user2.avatar : friendship.user1.avatar,
    bio: friendship.user1Id === userId ? friendship.user2.bio : friendship.user1.bio,
    age: friendship.user1Id === userId ? friendship.user2.age : friendship.user1.age,
    friendshipDate: friendship.createdAt,
  }));

  sendPaginatedSuccess(res, friends, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, 'Friends retrieved successfully');
});

export const removeFriend = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { friendId } = req.params;

  // Find friendship
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: friendId },
        { user1Id: friendId, user2Id: userId },
      ],
    },
  });

  if (!friendship) {
    throw createError('Friendship not found', 404);
  }

  // Delete friendship
  await prisma.friendship.delete({
    where: { id: friendship.id },
  });

  sendSuccess(res, null, 'Friend removed successfully');
});
