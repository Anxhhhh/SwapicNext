import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import { sendVerificationEmail } from '../utils/mailer.js';
import { auth } from '../config/firebase.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, (process.env.JWT_ACCESS_SECRET || 'swapic_secret_key_123') as string, {
    expiresIn: '30d',
  });
};

// Direct login via Google (Google already verifies user email)
export const firebaseLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'No Firebase ID token provided' });
      return;
    }

    // 1. Verify token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if user exists in database
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email: email }],
    });

    // 3. If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        name: name || email?.split('@')[0] || 'Swapic User',
        email,
        firebaseUid: uid,
        avatarUrl: picture,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = uid;
      if (picture && !user.avatarUrl) {
        user.avatarUrl = picture;
      }
      await user.save();
    }

    // 4. Return custom JWT token
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ message: 'Invalid or expired Firebase token' });
  }
};

// Send OTP for email/password sign in
export const sendLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a secure 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate existing codes for this email and purpose
    await VerificationCode.deleteMany({ email: cleanEmail, purpose: 'login' });

    // Store new code valid for 10 minutes
    await VerificationCode.create({
      email: cleanEmail,
      code,
      purpose: 'login',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email
    const { isDev } = await sendVerificationEmail(cleanEmail, code, 'login');

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      devCode: isDev ? code : undefined,
    });
  } catch (error: any) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ message: error.message || 'Failed to send verification code' });
  }
};

// Verify OTP for email/password sign in
export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, idToken } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: 'Email and verification code are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    // Verify OTP record
    const record = await VerificationCode.findOne({
      email: cleanEmail,
      code: cleanCode,
      purpose: 'login',
    });

    if (!record) {
      res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
      return;
    }

    if (new Date() > record.expiresAt) {
      await VerificationCode.deleteMany({ email: cleanEmail });
      res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
      return;
    }

    // Code is valid - remove it
    await VerificationCode.deleteMany({ email: cleanEmail });

    // Find or register user
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        firebaseUid: `email_${Date.now()}`,
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    console.error('Error verifying login OTP:', error);
    res.status(500).json({ message: error.message || 'Verification failed' });
  }
};

// Send OTP for new account creation
export const sendSignupOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      res.status(400).json({ message: 'An account with this email already exists. Please sign in instead.' });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.deleteMany({ email: cleanEmail, purpose: 'signup' });

    await VerificationCode.create({
      email: cleanEmail,
      code,
      purpose: 'signup',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const { isDev } = await sendVerificationEmail(cleanEmail, code, 'signup');

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      devCode: isDev ? code : undefined,
    });
  } catch (error: any) {
    console.error('Error sending signup OTP:', error);
    res.status(500).json({ message: error.message || 'Failed to send verification code' });
  }
};

// Verify OTP and complete registration
export const verifySignupOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: 'Email and verification code are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = await VerificationCode.findOne({
      email: cleanEmail,
      code: cleanCode,
      purpose: 'signup',
    });

    if (!record) {
      res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
      return;
    }

    if (new Date() > record.expiresAt) {
      await VerificationCode.deleteMany({ email: cleanEmail });
      res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
      return;
    }

    await VerificationCode.deleteMany({ email: cleanEmail });

    // Create user
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name: (name && name.trim()) || cleanEmail.split('@')[0],
        email: cleanEmail,
        firebaseUid: `email_${Date.now()}`,
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    console.error('Error verifying signup OTP:', error);
    res.status(500).json({ message: error.message || 'Registration verification failed' });
  }
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const targetEmail = (email && email.trim()) || 'aarav@swapic.app';

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = await User.create({
        name: targetEmail.includes('admin') ? 'Swapic Admin' : 'Aarav Sharma',
        email: targetEmail,
        firebaseUid: `demo_${Date.now()}`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop',
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    res.status(200).json(req.user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
