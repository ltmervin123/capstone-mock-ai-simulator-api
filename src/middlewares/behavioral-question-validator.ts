import {
  behavioralQuestionIdSchema,
  behavioralQuestionSchema,
  behavioralQuestionIdWithNumberOfQuestionsSchema,
} from '../zod-schemas/behavioral-question-zod-schema';
import { Request, Response, NextFunction } from 'express';

export const validateBehavioralQuestionId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = behavioralQuestionIdSchema.parse(req.params);
    req.params = parseResult;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateBehavioralQuestion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionData = behavioralQuestionSchema.parse(req.body);
    req.body = questionData;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateBehavioralCategoryNumberOfQuestionsToBeAnswered = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionData = behavioralQuestionIdWithNumberOfQuestionsSchema.parse(req.params);
    res.locals.validatedParams = questionData;
    next();
  } catch (error) {
    next(error);
  }
};
