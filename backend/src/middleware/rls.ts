import { Request, Response, NextFunction } from 'express';
import { Transaction } from 'sequelize';
import { withRLSTransaction } from '../config/database';

export interface RLSRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'client' | 'admin';
    clientId?: string;
  };
  withRLS?: <T>(fn: (t: Transaction) => Promise<T>) => Promise<T>;
}

export function rlsMiddleware(req: RLSRequest, _res: Response, next: NextFunction) {
  req.withRLS = async <T>(fn: (t: Transaction) => Promise<T>): Promise<T> => {
    // Read req.user dynamically at execution time (after authenticate middleware has populated req.user)
    const clientId = req.user?.clientId || null;
    const role = req.user?.role || 'client';

    return withRLSTransaction<T>(clientId, role, fn);
  };

  next();
}
