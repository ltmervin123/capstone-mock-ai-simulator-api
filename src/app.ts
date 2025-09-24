import express, { type Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import logger from './utils/logger';
import mongoDB from './configs/mongodb-config';
import authRoutes from './routes/auth-route';
import { errorHandler } from './middlewares/error-handler';
import { CONFIG } from './utils/constant-value';

const BASE_API = '/api/v1';
const { PORT } = CONFIG;
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${BASE_API}/auth`, authRoutes);

//Error Handler
app.use(errorHandler);

const startApp = async () => {
  try {
    await mongoDB.initializeConnection();
    logger.info(`🚀 Server running on port ${PORT}`);
  } catch (error: unknown) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
  }
};

app.listen(async (): Promise<void> => {
  await startApp();
});
