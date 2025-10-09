import { z } from 'zod';

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

export type GenerateGreetingResponsePayload = z.infer<typeof generateGreetingResponsePayload>;
export type TextToSpeechPayload = z.infer<typeof textToSpeechPayload>;
