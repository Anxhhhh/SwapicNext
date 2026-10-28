import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../config/firebase.js'; // Ensure the path is correct

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '30d',
  });
};

export const firebaseLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'No Firebase ID token provided' });
      return;
    }

    // 1. Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if user exists in our database
    let user = await User.findOne({ 
      $or: [{ firebaseUid: uid }, { email: email }]
    });

    // 3. If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        name: name || email?.split('@')[0] || 'Unknown User',
        email,
        firebaseUid: uid,
        avatarUrl: picture
      });
    } else if (!user.firebaseUid) {
      // If user existed from old system but no firebaseUid, link it
      user.firebaseUid = uid;
      if (picture && !user.avatarUrl) {
          user.avatarUrl = picture;
      }
      await user.save();
    }

    // 4. Generate our own custom JWT token and send it to the client
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token: generateToken(user.id),
    });

  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    res.status(401).json({ message: 'Invalid or expired Firebase token' });
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
