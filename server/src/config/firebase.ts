import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to local service account key file
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

let firebaseApp: App | undefined;

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      // If base64 encoded, decode it
      if (!raw.startsWith('{')) {
        raw = Buffer.from(raw, 'base64').toString('utf-8');
      }
      const serviceAccount = JSON.parse(raw);
      firebaseApp = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT env');
    } catch (err: any) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env:', err.message);
    }
  } else if (fs.existsSync(serviceAccountPath)) {
    try {
      firebaseApp = initializeApp({
        credential: cert(serviceAccountPath)
      });
      console.log('✅ Firebase Admin initialized from serviceAccountKey.json');
    } catch (err: any) {
      console.error('❌ Failed to initialize Firebase Admin from serviceAccountKey.json:', err.message);
    }
  } else {
    console.warn('⚠️ Firebase Admin credentials not found. Provide FIREBASE_SERVICE_ACCOUNT env or serviceAccountKey.json.');
  }
} else {
  firebaseApp = getApps()[0];
}

// Export the auth module safely
export const auth: Auth = firebaseApp ? getAuth(firebaseApp) : ({} as Auth);
