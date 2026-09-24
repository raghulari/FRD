import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { RLSRequest } from './rls';

export function authenticate(req: RLSRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      clientId: payload.clientId,
    };
    return next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Invalid or expired access token' });
  }
}

export function requireRole(...roles: ('client' | 'admin')[]) {
  return (req: RLSRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
    }

    return next();
  };
}
