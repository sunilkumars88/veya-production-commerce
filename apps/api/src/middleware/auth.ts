import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from '../lib/db.js';
import { config } from '../../../../packages/config/src/index.js';
import { AppError } from '../lib/errors.js';

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token'];
  if (!token || token !== config.adminToken) {
    return next(new AppError('UNAUTHORIZED', 'Admin authentication required', 401));
  }
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();

  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const session = await db.userSession.findFirst({
    where: { tokenHash: hash, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (session) (req as any).user = session.user;
  next();
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  await optionalAuth(req, _res, () => {
    if (!(req as any).user) return next(new AppError('UNAUTHORIZED', 'Authentication required', 401));
    next();
  });
}
