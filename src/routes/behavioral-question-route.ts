import { Router } from 'express';
import { globalRateLimiter } from '../configs/rate-limit-config';
import { authCheckHandler } from '../middlewares/auth-check-handler';
import * as BehavioralQuestionController from '../controllers/behavioral-question-controller';
import * as BehavioralQuestionValidator from '../middlewares/behavioral-question-validator';
const router = Router();

/**
 * @route GET /api/v1/behavioral-questions/
 * @description Retrieve behavioral question categories
 * @access Public
 * @rateLimit globalRateLimiter
 * @returns {status, message, categories}
 */
router.get(
  '/',
  globalRateLimiter,
  authCheckHandler,
  BehavioralQuestionController.getBehavioralCategories
);

/**
 * @route GET /api/v1/behavioral-questions/:questionId
 * @description Retrieve a specific behavioral question
 * @access Public
 * @rateLimit globalRateLimiter
 * @returns {status, message, question}
 */
router.get(
  '/:questionId',
  globalRateLimiter,
  authCheckHandler,
  BehavioralQuestionValidator.validateBehavioralQuestionId,
  BehavioralQuestionController.getBehavioralQuestionById
);

export default router;
