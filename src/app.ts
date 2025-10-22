import './workers/email-worker';
import './workers/claude-worker';
import 'dotenv/config';
import express, { NextFunction, type Application, Response, Request } from 'express';
import http from 'http';
import cors from 'cors';
import logger from './utils/logger';
import mongoDB from './configs/mongodb-config';
import { errorHandler } from './middlewares/error-handler';
import { CONFIG } from './utils/constant-value';
import { CORS_OPTIONS } from './configs/cors-config';
import { NotFoundError } from './utils/errors';
import { createUploadFolder } from './utils/init-upload-folder';
import cookieParser from 'cookie-parser';
import { socketService } from './configs/socket-io';
import authRoutes from './routes/auth-route';
import interviewRoutes from './routes/interview-route';
import behavioralQuestionRoutes from './routes/behavioral-question-route';

const BASE_API = '/api/v1';
const { PORT, API_URL, CLIENT_URL } = CONFIG;

// Express app setup
const app: Application = express();

// HTTP server setup
const server = http.createServer(app);

// Security middlewares
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${BASE_API}/auth`, authRoutes);
app.use(`${BASE_API}/interview`, interviewRoutes);
app.use(`${BASE_API}/behavioral-questions`, behavioralQuestionRoutes);

// catch-all route for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

//Error Handler
app.use(errorHandler);

const startApp = async () => {
  try {
    socketService.initialize(server, CORS_OPTIONS);
    await mongoDB.initializeConnection();
    await createUploadFolder();
    logger.info(`Server running on ${API_URL}:${PORT} | Client URL: ${CLIENT_URL}`);
  } catch (error: unknown) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
  }
};

server.listen(PORT, async (): Promise<void> => {
  await startApp();
});
