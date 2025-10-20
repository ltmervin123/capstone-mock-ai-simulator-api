import { number, z } from 'zod';
import { duration } from 'zod/v4/classic/iso.cjs';

export const textToSpeechPayload = z.object({
  text: z
    .string()
    .min(1, { message: 'Text is required' })
    .max(5000, { message: 'Text must be at most 5000 characters long' }),
  selectedVoice: z.enum(['Steve', 'Alice'], {
    message: 'Selected voice must be either Steve or Alice',
  }),
});

export const generateGreetingResponsePayload = z.object({
  userName: z.string().min(1, { message: 'User name is required' }),
  interviewerName: z.string().min(1, { message: 'Interviewer name is required' }),
  interviewType: z.enum(['Basic', 'Behavioral', 'Expert'], {
    message: 'Interview type must be Basic, Behavioral, or Expert',
  }),
  conversation: z.object({
    AI: z.string().min(1, { message: 'AI conversation text is required' }),
    CANDIDATE: z.string().min(1, { message: 'Candidate conversation text is required' }),
  }),
});

export const generateFollowUpQuestionPayload = z.object({
  interviewType: z.enum(['Basic', 'Behavioral', 'Expert'], {
    message: 'Interview type must be Basic, Behavioral, or Expert',
  }),
  conversation: z
    .array(
      z.object({
        AI: z.string().min(1, { message: 'AI conversation text is required' }),
        CANDIDATE: z.string().min(1, { message: 'Candidate conversation text is required' }),
      })
    )
    .min(1, { message: 'At least one conversation turn is required' })
    .max(5, { message: 'A maximum of 5 conversation turns is allowed' }),
});

export const generateInterviewFeedbackPayload = z.object({
  interviewType: z.enum(['Basic', 'Behavioral', 'Expert'], {
    message: 'Interview type must be Basic, Behavioral, or Expert',
  }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  numberOfQuestions: z.number().min(1, { message: 'At least one question is required' }),
  conversation: z
    .array(
      z.object({
        AI: z.string().min(1, { message: 'AI text is required' }),
        CANDIDATE: z.string().min(1, { message: 'Candidate text is required' }),
      })
    )
    .min(1, { message: 'At least one question-answer pair is required' })
    .max(20, { message: 'A maximum of 20 question-answer pairs is allowed' }),
});

export const interviewIdSchema = z
  .string()
  .min(24, { message: 'Interview ID must be a valid mongoose ObjectId' })
  .max(24, { message: 'Interview ID must be a valid mongoose ObjectId' });

export const expertInterviewPayload = z.object({
  jobTitle: z.string().min(1, { message: 'Job title is required' }).max(100, {
    message: 'Job title must be at most 100 characters long',
  }),
});
export type ExpertInterviewPayload = z.infer<typeof expertInterviewPayload>;
export type GenerateGreetingResponsePayload = z.infer<typeof generateGreetingResponsePayload>;
export type TextToSpeechPayload = z.infer<typeof textToSpeechPayload>;
export type GenerateFollowUpQuestionPayload = z.infer<typeof generateFollowUpQuestionPayload>;
export type GenerateInterviewFeedbackPayload = z.infer<typeof generateInterviewFeedbackPayload>;
