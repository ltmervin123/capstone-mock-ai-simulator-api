import * as TextToSpeechService from '../services/text-to-speech-service';
import * as GeminiService from '../services/claude-service';
import { Request, Response, NextFunction } from 'express';
import { TextToSpeechPayload as TextToSpeechPayloadType } from '../zod-schemas/interview-zod-schema';
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
    const greetingResponse = await GeminiService.generateGreetingResponse(greetingData);
    res.json({
      success: true,
      message: 'Greeting response generated successfully',
      greetingResponse,
    });
  } catch (error) {
    next(error);
  }
};
