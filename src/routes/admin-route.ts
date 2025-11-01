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

export default router;
