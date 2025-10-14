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
 * @returns { status, greetingResponse, message }
 */

router.post(
  '/greeting-response',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateGenerateGreetingResponse,
  InterviewController.generateGreetingResponse
);

/**
 * @route POST /api/v1/interview/follow-up-question
 * @description Generate a follow-up question for the user
 * @access Private
 * @rateLimit authRateLimiter
 * @body { interviewType, conversation }
 * @returns { status, followUpQuestion, message }
 */

router.post(
  '/follow-up-question',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateGenerateFollowUpQuestion,
  InterviewController.generateFollowUpQuestion
);

export default router;
