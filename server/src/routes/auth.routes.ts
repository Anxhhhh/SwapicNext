import express from 'express';
import {
  firebaseLogin,
  getMe,
  demoLogin,
  sendLoginOtp,
  verifyLoginOtp,
  sendSignupOtp,
  verifySignupOtp,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Direct Google / Firebase auth
router.post('/firebase', firebaseLogin);

// Email & password verification flow
router.post('/send-login-otp', sendLoginOtp);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);

// Demo login & current user
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;
