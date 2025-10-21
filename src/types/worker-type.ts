import { GenerateInterviewFeedbackPayload } from '../zod-schemas/interview-zod-schema';

export type GenerateInterviewFeedbackWorkerPayload = {
  studentId: string;
  payload: GenerateInterviewFeedbackPayload;
};
