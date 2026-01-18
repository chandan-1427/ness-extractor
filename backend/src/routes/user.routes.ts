import { Router } from 'express';
import { authenticateUser } from '../middlewares/authenticate.middleware.js';

const router = Router();

router.get('/me', authenticateUser, (req, res) => {
  res.json({
    userId: req.user?.id,
    message: 'Authenticated user',
  });
});

export default router;
