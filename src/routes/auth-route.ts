import { Router } from 'express';
import { authRateLimiter, globalRateLimiter } from '../configs/rate-limit-config';
import * as AuthController from '../controllers/auth-controller';
import * as AuthValidator from '../middlewares/auth-validator';
import { authCheckHandler, roleAdminCheck } from '../middlewares/auth-check-handler';
import { updateAdminEmail } from '../controllers/admin-controller';
import { updatePassword } from '../controllers/auth-controller';
const router = Router();

/**
 * @route POST /api/v1/auth/update-admin-email
 * @description Update admin account email
 * @access Private
 * @rateLimit globalRateLimter
 * @body {email}
 * @returns {status, message}
 */

router.post(
  '/update-admin-email',
  globalRateLimiter,
  authCheckHandler,
  roleAdminCheck,
  updateAdminEmail
);

/**
 * @route POST /api/v1/auth/account-password
 * @description Update admin account email
 * @access Private
 * @rateLimit globalRateLimter
 * @body {email}
 * @returns {status, message}
 */

router.post(
  '/update-account-password',
  globalRateLimiter,
  authCheckHandler,
  updatePassword
);

/**
 * @route POST /api/v1/auth/signup
 * @description Register a new student
 * @access Public
 * @rateLimit authRateLimiter
 * @body {firstName, middleName, lastName, email, program, password, studentId}
 * @returns {status, message}
 */
router.post('/signup', authRateLimiter, AuthValidator.validateStudentSignup, AuthController.signup);

/**
 * @route POST /api/v1/auth/signin
 * @description Sign in an existing student
 * @access Public
 * @rateLimit authRateLimiter
 * @body {email, password}
 * @returns {status, message, data}
 */

router.post('/signin', authRateLimiter, AuthValidator.validateSignin, AuthController.signin);

/**
 * @route POST /api/v1/auth/signout
 * @description Sign out an authenticated student
 * @access Private
 * @rateLimit authRateLimiter
 * @returns {status, message}
 */
router.post('/signout', authRateLimiter, authCheckHandler, AuthController.signout);

/**
 * @route POST /api/v1/auth/me
 * @description Check if the user is authenticated
 * @access Private
 * @rateLimit authRateLimiter
 * @returns {status, message}
 */
router.post('/me', globalRateLimiter, authCheckHandler, AuthController.me);

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
  AuthController.verifyEmail
);

export default router;
