import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import apiRoutes from './routes/index.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

const app = express();

const addDomainVariants = (origin) => {
  if (!origin) return [];

  try {
    const url = new URL(origin);
    const host = url.hostname;
    const baseHost = host.startsWith('www.') ? host.slice(4) : host;

    return [
      origin,
      `${url.protocol}//${baseHost}`,
      `${url.protocol}//www.${baseHost}`,
    ];
  } catch {
    return [origin];
  }
};

const allowedOrigins = new Set([
  ...addDomainVariants(process.env.FRONTEND_URL),
  'https://divinedhenu.com',
  'https://www.divinedhenu.com',
  'https://divinedhenu.vercel.app',
  'http://localhost:5173',
].filter(Boolean));

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
