import { z } from 'zod';

export const payload = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })

    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return domain === 'normi.edu.ph';
      },
      { message: 'Email must be a @normi.edu.ph address' }
    )
    .min(1, { message: 'Email is required' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
});

export type SigninPayload = z.infer<typeof payload>;
