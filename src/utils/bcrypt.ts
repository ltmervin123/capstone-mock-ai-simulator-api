import bcrypt from 'bcrypt';

export const generateHash = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};
export const compareHash = async (data: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(data, hash);
};
