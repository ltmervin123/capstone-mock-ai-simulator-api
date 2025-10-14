/* eslint-disable no-useless-catch */
import { Worker, Job } from 'bullmq';
import RedisConnection from '../configs/redis-config';
import logger from '../utils/logger';
import * as ClaudeWorker from '../services/worker-service';
import { GenerateInterviewFeedbackWorkerPayload } from '../types/worker-type';

const JOBS = {
  GENERATE_INTERVIEW_FEEDBACK: 'generate-interview-feedback',
};

const claudeWorker = new Worker(
  'claude-service',
  async (job: Job) => {
    try {
      if (job.name === JOBS.GENERATE_INTERVIEW_FEEDBACK) {
        const data: GenerateInterviewFeedbackWorkerPayload = job.data;
        await ClaudeWorker.createInterviewFeedback(data);
        return;
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

claudeWorker.on('ready', () => {
  logger.info('Claude worker is ready and running');
});

claudeWorker.on('error', (err) => {
  logger.error('Claude worker error:', err);
});

claudeWorker.on('failed', async (job, err) => {
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

claudeWorker.on('completed', (job) => {
  logger.info(`Claude job ${job.id} completed successfully`);
});

claudeWorker.on('stalled', (jobId) => {
  logger.info(`Claude job ${jobId} stalled`);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down Claude worker gracefully...');
  await claudeWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down Claude worker gracefully...');
  await claudeWorker.close();
  process.exit(0);
});

export default claudeWorker;
