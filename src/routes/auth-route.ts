import { Router } from 'express';
import { authRateLimiter } from '../configs/rate-limit-config';
import * as StudentController from '../controllers/student-controller';
import * as AuthValidator from '../middlewares/auth-validator';
const router = Router();

/**
 * @route POST /api/v1/auth/signup
 * @description Register a new student
 * @access Public
 * @rateLimit authRateLimiter
 * @body {firstName, middleName, lastName, email, program, password, studentId}
 * @returns {status, message}
 */
router.post(
  '/signup',
  authRateLimiter,
  AuthValidator.validateStudentSignup,
  StudentController.signup
);

/**
 * @route POST /api/v1/auth/signin
 * @description Sign in an existing student
 * @access Public
 * @rateLimit authRateLimiter
 * @body {email, password}
 * @returns {status, message, data}
 */

router.post('/signin', authRateLimiter, AuthValidator.validateSignin, StudentController.signin);

/**
 * @route POST /api/v1/auth/verify-email/token
 * @description Register a new student
 * @access Public
 * @rateLimit authRateLimiter
 * @body {firstName, middleName, lastName, email, program, password, studentId}
 * @returns {status, message}
 */
router.post(
  '/verify-email/:token',
  authRateLimiter,
  AuthValidator.validateVerifyStudentEmail,
  StudentController.verifyEmail
);

export default router;
