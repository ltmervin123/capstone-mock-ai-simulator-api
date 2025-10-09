import { Router } from 'express';
import { globalRateLimiter } from '../configs/rate-limit-config';
import * as InterviewController from '../controllers/interview-controller';
import * as InterviewValidator from '../middlewares/interview-validator';
import { authCheckHandler } from '../middlewares/auth-check-handler';
const router = Router();

/**
 * @route POST /api/v1/interview/text-to-speech
 * @description Convert text to speech using Google Text-to-Speech API
 * @access Private
 * @rateLimit authRateLimiter
 * @body { text, selectedVoice }
 * @returns { status, audioContent }
 */

router.post(
  '/text-to-speech',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateTextToSpeech,
  InterviewController.convertTextToSpeech
);

/**
 * @route POST /api/v1/interview/greeting-response
 * @description Generate a greeting response for the user
 * @access Private
 * @rateLimit authRateLimiter
 * @body { text, selectedVoice }
 * @returns { status, audioContent }
 */

router.post('/greeting-response', InterviewController.generateGreetingResponse);

export default router;
