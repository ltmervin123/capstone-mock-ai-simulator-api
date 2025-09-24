import express, { Request, Response, Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import logger from './src/utils/logger';
import mongoDB from './src/config/mongodb-config';
import { CONFIG } from './src/utils/constant-value';
const { PORT } = CONFIG;
const app: Application = express();
app.use(cors());
app.use(express.json());

const startApp = async () => {
  try {
    await mongoDB.initializeConnection();
    logger.info(`Server running on port ${PORT}`);
  } catch (error: unknown) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
  }
};

app.listen(async (): Promise<void> => {
  await startApp();
});
