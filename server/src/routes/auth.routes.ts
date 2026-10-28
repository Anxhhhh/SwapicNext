import express from 'express';
import { firebaseLogin, getMe, demoLogin } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// One route handles both login and registration via Firebase
router.post('/firebase', firebaseLogin);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;
