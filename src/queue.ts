import { Queue, Job, JobsOptions } from 'bullmq';
import RedisConnection from './configs/redis.config';
import logger from './utils/logger';

class QueueService {
  private static instances = new Map<string, QueueService>();
  private queue: Queue;

  private constructor(queueName: string) {
    this.queue = new Queue(queueName, {
      connection: RedisConnection.getInstance().getConnection(),
      defaultJobOptions: {
        attempts: 10,
        backoff: { type: 'exponential', delay: 10000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }

  public static getInstance(queueName: string): QueueService {
    if (!this.instances.has(queueName)) {
      this.instances.set(queueName, new QueueService(queueName));
    }
    return this.instances.get(queueName)!;
  }

  async addJob<T = unknown>(
    jobName: string,
    data: T,
    options?: JobsOptions
  ): Promise<Job<T, unknown, string>> {
    logger.info(`✅ Job added: ${jobName} Job Data: ${JSON.stringify(data)}`);
    return await this.queue.add(jobName, data, options);
  }
}

export default QueueService;
