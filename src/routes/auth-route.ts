import { Router } from 'express';
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
router.post('/signup', AuthValidator.validateStudentSignup, StudentController.signup);

export default router;
