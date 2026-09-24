import { Router, Response } from 'express';
import { User, Client, AuditLog } from '../models';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { registerSchema, loginSchema, createAdminSchema } from '../validations/auth.validation';
import { authenticate, requireRole } from '../middleware/auth';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { RLSRequest } from '../middleware/rls';

const router = Router();

// Helper to extract cookie parser or raw cookie string
function getRefreshTokenFromReq(req: any): string | null {
  if (req.cookies && req.cookies.refreshToken) {
    return req.cookies.refreshToken;
  }
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc: any, c: string) => {
      const [k, v] = c.trim().split('=');
      acc[k] = v;
      return acc;
    }, {});
    if (cookies.refreshToken) return cookies.refreshToken;
  }
  return req.body?.refreshToken || null;
}

/**
 * POST /api/v1/auth/register
 * Public client registration route
 */
router.post('/register', async (req: RLSRequest, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: parseResult.error.flatten() });
    }

    const { email, password, company_name } = parseResult.data;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const password_hash = await hashPassword(password);

    // Create user and client
    const user = await User.create({
      email: email.toLowerCase(),
      password_hash,
      role: 'client',
    });

    const client = await Client.create({
      user_id: user.id,
      company_name,
      company_details: {},
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: 'client',
      clientId: client.id,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: 'client',
      clientId: client.id,
    });

    // Set refresh cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: 'Registration successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        client: {
          id: client.id,
          company_name: client.company_name,
        },
      },
    });
  } catch (error: any) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/auth/login
 * Login for clients & admins with strict rate limiting
 */
router.post('/login', loginRateLimiter, async (req: RLSRequest, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: parseResult.error.flatten() });
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [{ model: Client, as: 'client' }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const client = (user as any).client;
    const clientId = client?.id;

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        client: client ? { id: client.id, company_name: client.company_name } : null,
      },
    });
  } catch (error: any) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/auth/refresh
 * Issue new access token using httpOnly refresh cookie
 */
router.post('/refresh', async (req: RLSRequest, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromReq(req);
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findByPk(payload.userId, {
      include: [{ model: Client, as: 'client' }],
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    const client = (user as any).client;
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId: client?.id,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

/**
 * POST /api/v1/auth/logout
 * Clear refresh cookie
 */
router.post('/logout', (_req: RLSRequest, res: Response) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * POST /api/v1/auth/admin/create
 * Protected Admin-only endpoint to create new Admin accounts
 */
router.post(
  '/admin/create',
  authenticate,
  requireRole('admin'),
  async (req: RLSRequest, res: Response) => {
    try {
      const parseResult = createAdminSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res
          .status(400)
          .json({ error: 'Validation Error', details: parseResult.error.flatten() });
      }

      const { email, password } = parseResult.data;

      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const password_hash = await hashPassword(password);
      const newAdmin = await User.create({
        email: email.toLowerCase(),
        password_hash,
        role: 'admin',
      });

      // Write to audit log
      await AuditLog.create({
        actor_user_id: req.user!.id,
        action: 'ADMIN_ACCOUNT_CREATED',
        target_type: 'user',
        target_id: newAdmin.id,
        details: { new_admin_email: newAdmin.email },
      });

      return res.status(201).json({
        message: 'Admin account created successfully',
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    } catch (error: any) {
      console.error('[Create Admin Error]:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/v1/auth/me
 * Protected endpoint returning active user info
 */
router.get('/me', authenticate, async (req: RLSRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'email', 'role', 'created_at'],
      include: [{ model: Client, as: 'client' }],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
