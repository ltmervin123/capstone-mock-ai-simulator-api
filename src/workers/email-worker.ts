/* eslint-disable no-useless-catch */
import { Worker, Job } from 'bullmq';
import RedisConnection from '../configs/redis-config';
import logger from '../utils/logger';
import Email from '../third-parties/email';

export type EmailData = {
  to: string;
  subject: string;
  html: string;
};

const emailWorker = new Worker(
  'email-service',
  async (job: Job) => {
    try {
      if (job.name === 'verification-email') {
        await Email.sendEmail(job.data);
      }
    } catch (error) {
      throw error;
    }
  },
  {
    connection: RedisConnection.getInstance().getConnection(),
    autorun: true,
    concurrency: 3,
  }
);

emailWorker.on('ready', () => {
  logger.info('Email worker is ready and running');
});

emailWorker.on('error', (err) => {
  logger.error('Email worker error:', err);
});

emailWorker.on('failed', async (job, err) => {
  if (err.message.startsWith('[NO_RETRY]')) {
    logger.error(`Job ${job?.id ?? 'unknown'} failed with no retry: ${err.message}`);
    await job?.remove();
  } else {
    logger.error(`System Error - With Retry`, {
      error: (err as Error).name,
      stack: (err as Error).stack!,
      message: (err as Error).message,
    });
  }
});

emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job.id} completed successfully`);
});

emailWorker.on('stalled', (jobId) => {
  logger.info(`Email job ${jobId} stalled`);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down Email worker gracefully...');
  await emailWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down Email worker gracefully...');
  await emailWorker.close();
  process.exit(0);
});

export default emailWorker;
