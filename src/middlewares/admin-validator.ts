import { Request, Response, NextFunction } from 'express';
import { resolveStudentApplicationSchema, questionConfig } from '../zod-schemas/admin-zod-schema';

export const validateResolveStudentApplication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = resolveStudentApplicationSchema.parse(req.body);
    req.body = result;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateUpdateQuestionConfig = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = questionConfig.parse(req.params);
    res.locals = result;
    next();
  } catch (err) {
    next(err);
  }
};
