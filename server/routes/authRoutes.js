import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
