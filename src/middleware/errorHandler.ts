import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  console.error('Error:', error);

  // ApiError (custom errors)
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }

  // Prisma duplicate key error
  if (error.code === 'P2002') {
    const message = 'Duplicate field value entered';
    err = new ApiError(409, message);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Prisma validation error
  if (error.code === 'P2025') {
    const message = 'Record not found';
    err = new ApiError(404, message);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    err = new ApiError(401, message);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    err = new ApiError(401, message);
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
  });
};