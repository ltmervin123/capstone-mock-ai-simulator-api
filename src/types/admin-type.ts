import { TopStudent } from './interview-type';

export type AdminDashboardStatsType = {
  totalVerifiedStudents: number;
  monthlyNewStudents: number;
  totalPendingStudents: number;
  dailyNewPendingStudents: number;
  studentsCountsByProgram: Record<string, number>;
  authenticatedStudents: number;
  overallRanking: TopStudent[];
  basicRanking: TopStudent[];
  behavioralRanking: TopStudent[];
  expertRanking: TopStudent[];
};
