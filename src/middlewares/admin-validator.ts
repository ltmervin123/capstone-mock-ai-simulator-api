import { Request, Response, NextFunction } from 'express';
import {
  resolveStudentApplicationSchema,
  questionConfig,
  interviewFilterSchema,
  studentFilterSchema,
} from '../zod-schemas/admin-zod-schema';

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

export const validateInterviewFilters = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = interviewFilterSchema.parse(req.query);
    res.locals.filters = result;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateSearchStudentFilters = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = studentFilterSchema.parse(req.query);
    res.locals.filters = result;
    next();
  } catch (err) {
    next(err);
  }
};
