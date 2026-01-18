import { Router } from 'express';
import { authenticateUser } from '../middlewares/authenticate.middleware.js';
import statementRouter from './statement.route.js';

const router = Router();

/**
 * 🔐 Secure boundary
 * All routes below require authentication
 */
router.use(authenticateUser);

// Future secure services go here
router.use('/statements', statementRouter);

export default router;
