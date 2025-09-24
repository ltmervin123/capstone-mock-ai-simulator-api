import { Router } from 'express';
import * as StudentController from '../controllers/student.controller';
const router = Router();

router.post('/signup', StudentController.signup);

export default router;
