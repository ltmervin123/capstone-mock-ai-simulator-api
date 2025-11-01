import * as AdminService from '../services/admin-service';
import { Request, Response, NextFunction } from 'express';

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getAdminDashboardStats();

    res.status(200).json({
      message: 'Admin dashboard stats fetched successfully.',
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};
