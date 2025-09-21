import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access token required', 401);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
      next();
    } catch (error) {
      sendError(res, 'Invalid or expired access token', 401);
    }
  } catch (error) {
    sendError(res, 'Authentication error', 401);
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = undefined;
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      req.user = undefined;
    }
    
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
};
