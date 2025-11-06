import { AdminDashboardStatsType } from '../types/admin-type';
import StudentModel from '../models/student.model';
import {
  generateAccountApprovedEmailTemplate,
  generateAccountRejectedEmailTemplate,
} from '../utils/email-template';
import { getClientURL } from '../utils/url';
import QueueService from '../queue';

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

export const resolveStudentApplication = async (
  id: string,
  action: 'ACCEPT' | 'REJECT'
): Promise<void> => {
  const link = getClientURL();

  const emailData = {
    to: '',
    subject: '',
    html: '',
  };

  if (action === 'ACCEPT') {
    const acceptedStudent = await StudentModel.acceptStudent(id);
    emailData.to = acceptedStudent.email;
    emailData.subject = 'Your Application has been Accepted';
    emailData.html = generateAccountApprovedEmailTemplate(acceptedStudent.firstName, link);
  }

  if (action === 'REJECT') {
    const rejectedStudent = await StudentModel.rejectStudent(id);
    emailData.to = rejectedStudent.email;
    emailData.subject = 'Your Application has been Rejected';
    emailData.html = generateAccountRejectedEmailTemplate(rejectedStudent.firstName, link);
  }

  await QueueService.getInstance('email-service').addJob('send-email', emailData);
};
