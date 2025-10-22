import { z } from 'zod';

export const student = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(100, { message: 'First name must be at most 100 characters long' }),
  middleName: z
    .string()
    .min(1, { message: 'Middle name is required' })
    .max(100, { message: 'Middle name must be at most 100 characters long' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(100, { message: 'Last name must be at most 100 characters long' }),
  studentId: z
    .string()
    .min(12, { message: 'Student ID must be exactly 12 digits long' })
    .max(12, { message: 'Student ID must be exactly 12 digits long' }),
  program: z.enum(
    [
      'Bachelor of Science in Business Administration',
      'Bachelor of Science in Information Technology',
      'Bachelor of Science in Criminology',
      'Bachelor of Science in Hospitality Management',
      'Bachelor of Science in Education',
      'Bachelor of Elementary Education',
    ],
    {
      message: 'Invalid program',
    }
  ),
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

export type Student = z.infer<typeof student>;
