import { z } from 'zod';

export const behavioralQuestionIdSchema = z.object({
  questionId: z
    .string()
    .min(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' })
    .max(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' }),
});

export type BehavioralQuestionIdSchema = z.infer<typeof behavioralQuestionIdSchema>;
