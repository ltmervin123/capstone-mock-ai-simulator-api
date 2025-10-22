import path from 'path';
import fs from 'fs';
import Logger from './logger';

const uploadsFolder = path.join(process.cwd(), 'uploads');

export const createUploadFolder = async (): Promise<void> => {
  try {
    if (!fs.existsSync(uploadsFolder)) {
      await fs.promises.mkdir(uploadsFolder);
      Logger.info(`Uploads folder created successfully`);
    }
  } catch (error) {
    Logger.error('Error creating uploads folder ', error as Error);
  }
};
