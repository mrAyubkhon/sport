import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', statusCode = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode = 500, error?: string): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  res.status(statusCode).json(response);
};

export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message = 'Success'
): void => {
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };

  const apiResponse: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    message,
    data: response,
  };

  res.json(apiResponse);
};
