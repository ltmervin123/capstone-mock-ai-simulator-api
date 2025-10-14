import * as TextToSpeechService from '../services/text-to-speech-service';
import * as ClaudeService from '../services/claude-service';
import * as InterviewService from '../services/interview-service';
import { Request, Response, NextFunction } from 'express';
import {
  GenerateInterviewFeedbackPayload,
  type GenerateFollowUpQuestionPayload,
  type TextToSpeechPayload as TextToSpeechPayloadType,
} from '../zod-schemas/interview-zod-schema';
import { type GenerateGreetingResponsePayload as GenerateGreetingResponsePayloadType } from '../zod-schemas/interview-zod-schema';

export const convertTextToSpeech = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as TextToSpeechPayloadType;

  try {
    const audioContent = await TextToSpeechService.convertTextToSpeech(data);
    res.json({
      success: true,
      message: 'Text converted to speech successfully',
      audioContent,
    });
  } catch (error) {
    next(error);
  }
};

export const generateGreetingResponse = async (req: Request, res: Response, next: NextFunction) => {
  const greetingData = req.body as GenerateGreetingResponsePayloadType;

  try {
    const greetingResponse = await ClaudeService.generateGreetingResponse(greetingData);
    res.json({
      success: true,
      message: 'Greeting response generated successfully',
      greetingResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const generateFollowUpQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as GenerateFollowUpQuestionPayload;

  try {
    const followUpQuestion = await ClaudeService.generateFollowUpQuestion(data);
    res.json({
      success: true,
      message: 'Follow-up question generated successfully',
      followUpQuestion,
    });
  } catch (error) {
    next(error);
  }
};

export const makeInterviewFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const studentId = req.user?._id!;
  const payload = req.body as GenerateInterviewFeedbackPayload;

  try {
    await InterviewService.makeInterviewFeedback(studentId, payload);
    res.json({
      success: true,
      message: 'Interview feedback job has been queued successfully',
    });
  } catch (error) {
    next(error);
  }
};
