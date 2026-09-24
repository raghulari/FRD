import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import frdRoutes from './routes/frd.routes';
import clientRoutes from './routes/client.routes';
import wizardRoutes from './routes/wizard.routes';
import catalogRoutes from './routes/catalog.routes';
import aiRoutes from './routes/ai.routes';
import { globalRateLimiter } from './middleware/rateLimiter';
import { rlsMiddleware } from './middleware/rls';

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Global Rate Limiting
app.use(globalRateLimiter);

// RLS Request Context
app.use(rlsMiddleware);

// Health Endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'frd-backend',
  });
});

// Auth, FRD, Client, Wizard, Catalog & AI API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/frds', frdRoutes);
app.use('/api/v1/frds', wizardRoutes);
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/ai', aiRoutes);

export default app;
