import { AdminDashboardStatsType } from '../types/admin-type';
import StudentModel from '../models/student.model';

export const getAdminDashboardStats = async (): Promise<AdminDashboardStatsType> => {
  const [
    totalVerifiedStudents,
    monthlyNewStudents,
    totalPendingStudents,
    dailyNewPendingStudents,
    studentsCountsByProgram,
    authenticatedStudents,
  ] = await Promise.all([
    StudentModel.getAllCountsOfVerifiedStudents(),
    StudentModel.getMonthlyIncrementedStudentCount(),
    StudentModel.getAllCountsOfPendingStudents(),
    StudentModel.getDailyIncreasedOfPendingStudents(),
    StudentModel.getCountsOfStudentsByProgram(),
    StudentModel.getCountsOfAuthenticatedStudents(),
  ]);

  return {
    totalVerifiedStudents,
    monthlyNewStudents,
    totalPendingStudents,
    dailyNewPendingStudents,
    studentsCountsByProgram,
    authenticatedStudents,
  };
};

export const getPendingStudents = async () => {
  return await StudentModel.getPendingStudents();
};

export const getAcceptedStudents = async () => {
  return await StudentModel.getAcceptedStudents();
};
