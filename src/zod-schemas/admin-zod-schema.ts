import { z } from 'zod';

export const resolveStudentApplicationSchema = z.object({
  id: z
    .string()
    .min(24, { message: 'Student ID must be 24 characters long.' })
    .max(24, { message: 'Student ID must be 24 characters long.' }),
  action: z.enum(['ACCEPT', 'REJECT']),
});

export type ResolveStudentApplicationPayload = z.infer<typeof resolveStudentApplicationSchema>;
