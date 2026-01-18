import { Router } from 'express';
import { createStatement, listStatements } from '../controllers/statement.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { statementInputSchema } from '../schemas/statement.schema.js';

const router = Router();

/**
 * POST /secure/statements
 * @desc Extracts data and saves to DB. Protected by global secure router.
 */
router.post(
  '/extract', 
  validate(statementInputSchema), 
  createStatement // This now has access to req.user because of the parent router
);

/**
 * GET /secure/statements
 * @desc Lists user statements with pagination. Protected by global secure router.
 */
router.get('/fetch', listStatements); // This now has access to req.user because of the parent router

export default router;