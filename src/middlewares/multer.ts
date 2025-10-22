import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../utils/errors';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const FILE_DESTINATION = path.join(process.cwd(), 'uploads');
const FILE_SIZE_LIMIT = 1 * 1024 * 1024; // 1 mb

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_DESTINATION);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only PDF and DOCX files are allowed'));
  }
}

const multerConfig = multer({
  storage: storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: fileFilter,
});

export default function uploadResume(req: Request, res: Response, next: NextFunction) {
  multerConfig.single('resume')(req, res, (err) => {
    if (err && err instanceof BadRequestError) {
      return next(err);
    }
    if (err && err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File size exceeds the 1MB limit'));
    }

    if (err) {
      return next(new BadRequestError('File upload failed'));
    }

    next();
  });
}
