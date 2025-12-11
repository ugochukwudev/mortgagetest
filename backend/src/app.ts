import express, { Request, Response } from 'express';
import cors from 'cors';
import env from './config/env.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import relationshipRoutes from './routes/relationship.routes.js';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/relationships', relationshipRoutes);

app.use(errorHandler);

export default app;

