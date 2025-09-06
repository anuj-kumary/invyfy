import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', 
  AuthController.signupValidation,
  AuthController.signup
);

router.post('/login', 
  AuthController.loginValidation,
  AuthController.login
);

router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', 
  authMiddleware,
  AuthController.getMe
);

export default router;
