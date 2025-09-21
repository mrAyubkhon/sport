import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateTokenPair } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { CreateUserData, LoginData, AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, age, weight, height, bio }: CreateUserData = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      age,
      weight,
      height,
      bio,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      weight: true,
      height: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  sendSuccess(res, {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginData = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  sendSuccess(res, {
    user: userWithoutPassword,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }, 'Login successful');
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken) {
    // Remove refresh token from database
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
        userId: req.user!.id,
      },
    });
  }

  sendSuccess(res, null, 'Logout successful');
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('Refresh token required', 400);
  }

  // Find refresh token in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw createError('Invalid or expired refresh token', 401);
  }

  // Generate new tokens
  const tokens = generateTokenPair({
    userId: storedToken.userId,
    email: storedToken.user.email,
  });

  // Update refresh token in database
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: {
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  sendSuccess(res, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }, 'Token refreshed successfully');
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  sendSuccess(res, user, 'Profile retrieved successfully');
});
