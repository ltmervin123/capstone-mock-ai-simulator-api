import { Request, Response, NextFunction } from 'express';
import { student } from '../zod-schemas/student-zod-schema';
// import { ZodError } from 'zod';
export const validateStudentSignup = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = student.parse(req.body);
    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
