import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, logoutSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', validate(logoutSchema), logout);

export default router;
