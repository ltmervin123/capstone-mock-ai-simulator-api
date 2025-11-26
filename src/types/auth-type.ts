export type AuthenticatedUserType = {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  nameExtension: string | null;
  program: string;
  role: string;
  email: string;
};
