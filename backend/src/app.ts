import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import healthRouter from './routes/health.route.js';
import authRouter from './routes/auth.routes.js';
import secureRoutes from './routes/secure.route.js';
import userRoutes from './routes/user.routes.js'

export const app = express();

// core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// security
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

// routes
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/secure', secureRoutes, userRoutes);

// global error handler (must be last)
app.use(errorHandler);
