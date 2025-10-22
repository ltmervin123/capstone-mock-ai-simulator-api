import { readFile } from 'fs/promises';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

const ALLOWED_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const parseDocx = async (filePath: string): Promise<string> => {
  const { value: text } = await mammoth.extractRawText({ path: filePath });
  return text;
};
const parsePdf = async (filePath: string): Promise<string> => {
  const buffer = await readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText({ partial: [1, 2] });
  await parser.destroy();
  return result.text;
};

export const parseFile = async (file: Express.Multer.File): Promise<string> => {
  const fileType = file.mimetype;

  if (fileType === ALLOWED_TYPES.pdf) {
    return await parsePdf(file.path);
  }
  if (fileType === ALLOWED_TYPES.docx || fileType === ALLOWED_TYPES.doc) {
    return await parseDocx(file.path);
  }

  throw new Error('Unsupported file type');
};
