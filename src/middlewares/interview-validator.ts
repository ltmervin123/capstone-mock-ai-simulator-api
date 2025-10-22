import { NextFunction, Request, Response } from 'express';
import {
  textToSpeechPayload as TextToSpeechPayloadSchema,
  generateGreetingResponsePayload as generateGreetingResponsePayloadSchema,
  generateFollowUpQuestionPayload as generateFollowUpQuestionPayloadSchema,
  generateInterviewFeedbackPayload as generateInterviewFeedbackPayloadSchema,
  interviewIdSchema,
  expertInterviewPayload as expertInterviewPayloadSchema,
} from '../zod-schemas/interview-zod-schema';
import { BadRequestError } from '../utils/errors';

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

export const validateMakeInterviewFeedback = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = generateInterviewFeedbackPayloadSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateInterviewIdParam = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = interviewIdSchema.parse(req.params.interviewId);
    req.params.interviewId = result;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUploadResume = (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = req.file as Express.Multer.File;
    const result = expertInterviewPayloadSchema.parse(req.body);
    if (!resume) {
      throw new BadRequestError('Resume file is required');
    }
    req.body = result;
    next();
  } catch (error) {
    next(error);
  }
};
