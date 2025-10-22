import { Router } from 'express';
import { globalRateLimiter } from '../configs/rate-limit-config';
import * as InterviewController from '../controllers/interview-controller';
import * as InterviewValidator from '../middlewares/interview-validator';
import { authCheckHandler } from '../middlewares/auth-check-handler';
import uploadResume from '../middlewares/multer';
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

/**
 * @route POST /api/v1/interview/make-interview-feedback
 * @description Generate interview feedback for the user
 * @access Private
 * @rateLimit authRateLimiter
 * @body { interviewType, conversation, duration, numberOfQuestions }
 * @returns { status, message }
 */

router.post(
  '/make-interview-feedback',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateMakeInterviewFeedback,
  InterviewController.makeInterviewFeedback
);

/**
 * @route POST /api/v1/interview/history
 * @description Generate interview feedback for the user
 * @access Private
 * @rateLimit authRateLimiter
 * @returns { status, message, interviewHistory }
 */

router.get(
  '/history',
  globalRateLimiter,
  authCheckHandler,
  InterviewController.getInterviewHistory
);

/**
 * @route POST /api/v1/interview/upload-resume
 * @description Upload user resume and generate expert interview questions
 * @access Private
 * @rateLimit authRateLimiter
 * @body { resume (file), jobTitle }
 * @returns { status, message, resumePath }
 */

router.post(
  '/upload-resume',
  globalRateLimiter,
  authCheckHandler,
  uploadResume,
  InterviewValidator.validateUploadResume,
  InterviewController.expertInterviewQuestions
);

/**
 * @route GET /api/v1/interview/dashboard-stats
 * @description Get user interview dashboard statistics
 * @access Private
 * @rateLimit authRateLimiter
 * @returns { status, message, dashboardStats }
 */

router.get(
  '/dashboard-stats',
  globalRateLimiter,
  authCheckHandler,
  InterviewController.getUserDashboardStat
);

/** * @route PUT /api/v1/interview/mark-as-viewed/:interviewId
 * @description Mark an interview as viewed by the user
 * @access Private
 * @rateLimit authRateLimiter
 * @params { interviewId }
 * @returns { status, message }
 */

router.put(
  '/mark-as-viewed/:interviewId',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateInterviewIdParam,
  InterviewController.updateUserUnViewedInterviewCount
);

/**
 * @route GET /api/v1/interview/viewed-interviews-count
 * @description Get count of viewed interviews by the user
 * @access Private
 * @rateLimit authRateLimiter
 * @returns { status, message, viewedInterviewsCount }
 */

router.get(
  '/un-viewed-interviews-count',
  authCheckHandler,
  InterviewController.getUserUnViewedInterviewCount
);

/**
 * @route POST /api/v1/interview/:interviewId
 * @description Get interview detail by ID
 * @access Private
 * @rateLimit authRateLimiter
 * @returns { status, message, interviewDetail }
 */

router.get(
  '/:interviewId',
  globalRateLimiter,
  authCheckHandler,
  InterviewValidator.validateInterviewIdParam,
  InterviewController.getInterviewDetail
);

export default router;
