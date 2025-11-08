import { z } from 'zod';

export const behavioralQuestionIdSchema = z.object({
  categoryId: z
    .string()
    .min(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' })
    .max(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' }),
});

export const behavioralQuestionIdWithNumberOfQuestionsSchema = z.object({
  categoryId: z
    .string()
    .min(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' })
    .max(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' }),
  numberOfQuestions: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: 'numberOfQuestions must be a valid number' })
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: 'numberOfQuestions must be greater than 0' }),
});

export const behavioralQuestionSchema = z.object({
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters long' })
    .max(500, { message: 'Description must be at most 500 characters long' }),
  category: z
    .string()
    .min(5, { message: 'Category must be at least 5 characters long' })
    .max(500, { message: 'Category must be at most 500 characters long' }),
  questions: z
    .array(
      z
        .string()
        .min(5, { message: 'Each question must be at least 5 characters long' })
        .max(500, { message: 'Each question must be at most 500 characters long' })
    )
    .min(1, { message: 'At least one question is required' }),
});

export type BehavioralQuestionIdSchema = z.infer<typeof behavioralQuestionIdSchema>;

export type BehavioralQuestionIdWithNumberOfQuestionsSchema = z.infer<
  typeof behavioralQuestionIdWithNumberOfQuestionsSchema
>;

export type BehavioralQuestionSchema = z.infer<typeof behavioralQuestionSchema>;
