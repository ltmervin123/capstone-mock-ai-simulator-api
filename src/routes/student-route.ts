import { Router } from 'express';
import * as StudentController from '../controllers/auth-controller';
const router = Router();

router.post('/signup', StudentController.signup);

export default router;
