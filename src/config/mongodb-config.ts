import mongoose from 'mongoose';
import { CONFIG } from '../utils/constant-value';
import logger from '../utils/logger';
import { DatabaseError } from '../utils/errors';

type DbConfigInterface = {
  dbName: string;
  connectTimeoutMS: number;
  socketTimeoutMS: number;
};

class DbConfig {
  private static instance: DbConfig;
  private config!: DbConfigInterface;
  private mongodbUrl!: string;

  constructor() {
    if (DbConfig.instance) {
      return DbConfig.instance;
    }

    this.config = {
      dbName: CONFIG.DATABASE.NAME!,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    this.mongodbUrl = CONFIG.DATABASE.URL!;

    DbConfig.instance = this;
  }

  async initializeConnection(): Promise<void> {
    try {
      await mongoose.connect(this.mongodbUrl, this.config);

      logger.info(`🛢 Database connected successfully`, {
        service: 'MongoDB',
        name: 'MongoConnection',
      });

      this.#handleConnectionEvents();
    } catch (error: unknown) {
      throw new DatabaseError(`❌ Mongoose connection failed ${(error as Error).message}`);
    }
  }

  async closeConnection(): Promise<void> {
    try {
      await mongoose.connection.close();
      logger.info('✅ Database connection closed successfully', {
        service: 'MongoDB',
      });
    } catch (error: unknown) {
      throw new DatabaseError(
        `❌ Failed to close database connection: ${(error as Error).message}`
      );
    }
  }

  #handleConnectionEvents(): void {
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔁 MongoDB reconnected');
    });

    mongoose.connection.on('error', (err: Error) => {
      logger.error('🔥 MongoDB error: ', err);
    });
  }
}

const mongoInstance = Object.freeze(new DbConfig());

process.on('SIGINT', async () => {
  await mongoInstance.closeConnection();
  process.exit(0);
});

export default mongoInstance;
