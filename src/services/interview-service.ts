import QueueService from '../queue';
import { type GenerateInterviewFeedbackPayload } from '../zod-schemas/interview-zod-schema';

export const makeInterviewFeedback = async (
  studentId: string,
  payload: GenerateInterviewFeedbackPayload
) => {
  await QueueService.getInstance('claude-service').addJob('generate-interview-feedback', {
    studentId,
    payload,
  });
};
