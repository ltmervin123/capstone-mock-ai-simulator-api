import * as AdminService from '../services/admin-service';
import { Request, Response, NextFunction } from 'express';
import { ResolveStudentApplicationPayload } from '../zod-schemas/admin-zod-schema';

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

export const getPendingStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pendingStudents = await AdminService.getPendingStudents();

    res.status(200).json({
      message: 'Pending students fetched successfully.',
      success: true,
      pendingStudents,
    });
  } catch (err) {
    next(err);
  }
};

export const getAcceptedStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const acceptedStudents = await AdminService.getAcceptedStudents();

    res.status(200).json({
      message: 'Accepted students fetched successfully.',
      success: true,
      acceptedStudents,
    });
  } catch (err) {
    next(err);
  }
};

export const resolveStudentApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, action } = req.body as ResolveStudentApplicationPayload;

    await AdminService.resolveStudentApplication(id, action);

    res.status(200).json({
      message: `Student application has been ${action === 'ACCEPT' ? 'accepted' : 'rejected'} successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
