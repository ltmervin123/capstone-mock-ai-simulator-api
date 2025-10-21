import { behavioralQuestionIdSchema } from '../zod-schemas/behavioral-question-zod-schema';
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
