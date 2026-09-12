import { Response } from 'express';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function sendError(res: Response, error: unknown, requestId?: string) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message, requestId },
    });
  }
  const message = error instanceof Error ? error.message : 'Internal server error';
  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: process.env.NODE_ENV === 'production' ? 'Internal server error' : message, requestId },
  });
}

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}
