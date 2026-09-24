import { Request, Response, NextFunction } from 'express';
import { RateLimitHit } from '../models/RateLimitHit';
import { Op } from 'sequelize';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Factory creating a Postgres-backed Rate Limiter middleware.
 */
export function postgresRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => `${req.ip}:${req.baseUrl}${req.path}`,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const now = Date.now();
      const windowStart = now - windowMs;

      // Find or create rate limit record
      const [hit, created] = await RateLimitHit.findOrCreate({
        where: { key },
        defaults: {
          key,
          window_start: now,
          count: 1,
        },
      });

      const currentWindowStart = Number(hit.window_start);

      if (!created) {
        if (currentWindowStart < windowStart) {
          // Reset window
          hit.window_start = now;
          hit.count = 1;
          await hit.save();
        } else if (hit.count >= max) {
          const secondsRemaining = Math.max(
            1,
            Math.ceil((currentWindowStart + windowMs - now) / 1000)
          );
          res.setHeader('Retry-After', secondsRemaining);
          return res.status(429).json({
            error: 'Too Many Requests',
            message,
            retryAfterSeconds: secondsRemaining,
          });
        } else {
          hit.count += 1;
          await hit.save();
        }
      }

      // Periodically clean up old hits (> 1 hour old) in background
      if (Math.random() < 0.05) {
        RateLimitHit.destroy({
          where: {
            window_start: { [Op.lt]: now - 3600000 },
          },
        }).catch(() => {});
      }

      return next();
    } catch (error) {
      // In case of rate limiter DB error, log and fail open to preserve availability
      console.error('[RateLimiter Error]:', error);
      return next();
    }
  };
}

// 1. Global IP Rate Limiter (100 reqs / 15 minutes)
export const globalRateLimiter = postgresRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => `global:${req.ip}`,
});

// 2. Strict Auth Login Rate Limiter (5 attempts / 15 minutes)
export const loginRateLimiter = postgresRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many failed login attempts. Please try again after 15 minutes.',
  keyGenerator: (req) => `login:${req.ip}`,
});

// 3. User-based Expensive Route Rate Limiter (10 reqs / 15 minutes)
export const expensiveRouteRateLimiter = postgresRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Expensive route request limit reached.',
  keyGenerator: (req: any) => `user_expensive:${req.user?.id || req.ip}`,
});
