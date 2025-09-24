import IORedis, { RedisOptions } from 'ioredis';
import logger from '../utils/logger';
import { CONFIG } from '../utils/constant-value';

class RedisConnection {
  private static instance: RedisConnection;
  private connection: IORedis | null = null;
  private HOST: string = CONFIG.REDIS.HOST!;
  private PORT: string = CONFIG.REDIS.PORT!;
  private PASSWORD: string = CONFIG.REDIS.PASSWORD!;

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public getConnection(): IORedis {
    if (!this.connection) {
      this.createConnection();
    }
    return this.connection!;
  }

  private createConnection(): void {
    const config: RedisOptions = {
      host: this.HOST,
      port: Number(this.PORT),
      password: this.PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times: number): number => {
        const delay = Math.min(Math.pow(2, times) * 100, 30000);
        return delay;
      },
      connectTimeout: 15000,
    };

    this.connection = new IORedis(config);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.connection) return;

    this.connection.on('connect', () => {
      logger.info(`🔗 Redis Connection Details:
        Host: ${this.HOST}
        Port: ${this.PORT}
      `);
    });

    this.connection.on('error', (err: Error) => {
      logger.error('❌ Redis connection error:', err);
    });

    this.connection.on('reconnecting', () => {
      logger.info('🔄 Reconnecting to Redis...');
    });

    this.connection.on('close', () => {
      logger.warn('⚠️ Redis connection closed');
    });
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
  }

  public isConnected(): boolean {
    return this.connection?.status === 'ready';
  }
}

export default RedisConnection;
