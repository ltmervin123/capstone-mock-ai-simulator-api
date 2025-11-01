import { Router } from 'express';
import * as AdminController from '../controllers/admin-controller';
import { authCheckHandler, roleAdminCheck } from '../middlewares/auth-check-handler';
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

export default router;
