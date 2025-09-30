import { Request, Response, NextFunction } from 'express';
import { student } from '../zod-schemas/student-zod-schema';
import { BadRequestError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { type VerifyEmailPayload } from '../types/student-type';
import { payload } from '../zod-schemas/auth-zod-schema';
export const validateStudentSignup = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = student.parse(req.body);
    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const validateVerifyStudentEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new BadRequestError('Token is required');
    }

    const result = verifyToken(token) as VerifyEmailPayload;

    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const validateSignin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = payload.parse(req.body);
    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
