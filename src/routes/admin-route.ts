import { Router } from 'express';
import * as AdminController from '../controllers/admin-controller';
import { authCheckHandler, roleAdminCheck } from '../middlewares/auth-check-handler';
import * as AdminValidator from '../middlewares/admin-validator';
import {
  validateBehavioralQuestionId,
  validateUpdateBehavioralCategoryNumberOfQuestionsToBeAnswered,
  validateUpdateBehavioralQuestion,
} from '../middlewares/behavioral-question-validator';
const router = Router();

/**
 * @route GET /api/v1/admin/dashboard-stats
 * @description Retrieve admin dashboard statistics
 * @access Private (Admin only)
 * @returns {status, message, stats}
 */
router.get(
  '/dashboard-stats',
  authCheckHandler,
  roleAdminCheck,
  AdminController.getAdminDashboardStats
);

/**
 * @route GET /api/v1/admin/pending-students
 * @description Retrieve list of pending students
 * @access Private (Admin only)
 * @returns {status, message, pendingStudents}
 */
router.get(
  '/pending-students',
  authCheckHandler,
  roleAdminCheck,
  AdminController.getPendingStudents
);

/**
 * @route GET /api/v1/admin/accepted-students
 * @description Retrieve list of accepted students
 * @access Private (Admin only)
 * @returns {status, message, acceptedStudents}
 */
router.get(
  '/accepted-students',
  authCheckHandler,
  roleAdminCheck,
  AdminController.getAcceptedStudents
);

/**
 * @route PUT /api/v1/admin/resolve-student-application
 * @description Resolve student application (accept or reject)
 * @access Private (Admin only)
 * @returns {status, message, acceptedStudents}
 */
router.put(
  '/resolve-student-application',
  authCheckHandler,
  roleAdminCheck,
  AdminValidator.validateResolveStudentApplication,
  AdminController.resolveStudentApplication
);

/**
 * @route PUT /api/v1/admin/behavioral-categories
 * @description Get behavioral question categories
 * @access Private (Admin only)
 * @returns {status, message, categories}
 */
router.get(
  '/behavioral-categories',
  authCheckHandler,
  roleAdminCheck,
  AdminController.getBehavioralCategories
);

/**
 * @route POST /api/v1/admin/behavioral-categories
 * @description CREATE behavioral question categories
 * @access Private (Admin only)
 * @returns {status, message, categories}
 */
router.post(
  '/behavioral-category',
  authCheckHandler,
  roleAdminCheck,
  validateUpdateBehavioralQuestion,
  AdminController.addCategory
);

/**
 * @route GET /api/v1/admin/question-config
 * @description Get question configuration
 * @access Private (Admin only)
 * @returns {status, message, categories}
 */
router.put(
  '/question-config',
  authCheckHandler,
  roleAdminCheck,
  AdminController.updateQuestionConfig
);

/**
 * @route PUT /api/v1/admin/question-config/:id/:numberOfQuestions
 * @description Update question configuration
 * @access Private (Admin only)
 * @returns {status, message, categories}
 */
router.put(
  '/question-config/:id/:numberOfQuestions',
  authCheckHandler,
  roleAdminCheck,
  AdminValidator.validateUpdateQuestionConfig,
  AdminController.updateQuestionConfig
);

/**
 * @route Get /api/v1/admin/behavioral-category/:categoryId
 * @description Get behavioral question categories
 * @access Private (Admin only)
 * @returns {status, message, categories}
 */
router.get(
  '/behavioral-category/:categoryId',
  authCheckHandler,
  roleAdminCheck,
  validateBehavioralQuestionId,
  AdminController.getBehavioralQuestion
);

/**
 * @route PUT /api/v1/admin/behavioral-category/:categoryId
 * @description Update behavioral question categories
 * @access Private (Admin only)
 * @returns {status, message}
 */
router.put(
  '/behavioral-category/:categoryId',
  authCheckHandler,
  roleAdminCheck,
  validateBehavioralQuestionId,
  validateUpdateBehavioralQuestion,
  AdminController.updateBehavioralQuestion
);

/**
 * @route DELETE /api/v1/admin/behavioral-category/:categoryId
 * @description Delete behavioral question categories
 * @access Private (Admin only)
 * @returns {status, message}
 */
router.delete(
  '/behavioral-category/:categoryId',
  authCheckHandler,
  roleAdminCheck,
  validateBehavioralQuestionId,
  AdminController.deleteBehavioralQuestion
);

/**
 * @route UPDATE /api/v1/admin/behavioral-category/number-of-question/:categoryId
 * @description Update the number of questions to be answered for a behavioral category
 * @access Private (Admin only)
 * @returns {status, message}
 */
router.put(
  '/behavioral-category/number-of-question/:categoryId/:numberOfQuestions',
  authCheckHandler,
  roleAdminCheck,
  validateUpdateBehavioralCategoryNumberOfQuestionsToBeAnswered,
  AdminController.updateBehavioralCategoryNumberOfQuestionsToBeAnswered
);

export default router;
