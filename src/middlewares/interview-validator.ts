import { NextFunction, Request, Response } from 'express';
import {
  textToSpeechPayload as TextToSpeechPayloadSchema,
  generateGreetingResponsePayload as generateGreetingResponsePayloadSchema,
  generateFollowUpQuestionPayload as generateFollowUpQuestionPayloadSchema,
} from '../zod-schemas/interview-zod-schema';

export const validateTextToSpeech = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = TextToSpeechPayloadSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateGenerateGreetingResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = generateGreetingResponsePayloadSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateGenerateFollowUpQuestion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = generateFollowUpQuestionPayloadSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    next(error);
  }
};
