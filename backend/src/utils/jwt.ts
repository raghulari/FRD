import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_access_token_secret_32_bytes_long_key_1234';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev_refresh_token_secret_32_bytes_long_key_5678';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'client' | 'admin';
  clientId?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
