import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = { userId };
  if (unreadOnly === 'true') {
    where.read = false;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
  ]);

  sendPaginatedSuccess(res, notifications, {
    page: Number(page),
    limit: Number(limit),
    total,
  }, 'Notifications retrieved successfully');
});

export const markNotificationAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { notificationId } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  sendSuccess(res, updatedNotification, 'Notification marked as read');
});

export const markAllNotificationsAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });

  sendSuccess(res, { updatedCount: result.count }, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { notificationId } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw createError('Notification not found', 404);
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  sendSuccess(res, null, 'Notification deleted successfully');
});

export const getNotificationStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const [total, unread, byType] = await Promise.all([
    prisma.notification.count({
      where: { userId },
    }),
    prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    }),
    prisma.notification.groupBy({
      by: ['type'],
      where: { userId },
      _count: {
        id: true,
      },
    }),
  ]);

  sendSuccess(res, {
    total,
    unread,
    byType,
  }, 'Notification statistics retrieved successfully');
});
