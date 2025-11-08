import { z } from 'zod';

export const resolveStudentApplicationSchema = z.object({
  id: z
    .string()
    .min(24, { message: 'Student ID must be 24 characters long.' })
    .max(24, { message: 'Student ID must be 24 characters long.' }),
  action: z.enum(['ACCEPT', 'REJECT']),
});

export const questionConfig = z.object({
  id: z
    .string()
    .min(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' })
    .max(24, { message: 'Behavioral question ID must be a valid mongoose ObjectId' }),
  numberOfQuestions: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: 'numberOfQuestions must be a valid number' })
    .refine((val) => val >= 5, { message: 'numberOfQuestions must be greater than or equal to 5' }),
});

export type ResolveStudentApplicationPayload = z.infer<typeof resolveStudentApplicationSchema>;

export type QuestionConfigParams = z.infer<typeof questionConfig>;
