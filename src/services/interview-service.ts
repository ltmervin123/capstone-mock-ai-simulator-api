import QueueService from '../queue';
import { type GenerateInterviewFeedbackPayload } from '../zod-schemas/interview-zod-schema';
import InterviewModel from '../models/interview-model';

export const makeInterviewFeedback = async (
  studentId: string,
  payload: GenerateInterviewFeedbackPayload
) => {
  await QueueService.getInstance('claude-service').addJob('generate-interview-feedback', {
    studentId,
    payload,
  });
};

export const getInterviewHistory = async (studentId: string) => {
  return await InterviewModel.getInterviewHistory(studentId);
};

export const getInterviewDetail = async (interviewId: string, studentId: string) => {
  return await InterviewModel.getInterviewDetail(interviewId, studentId);
};
