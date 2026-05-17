import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

// Replace with actual Firebase config or inject via EAS secrets
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA-fake-key-for-now',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'offhook-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'offhook-app',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'offhook-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export interface ReferralResult {
  success: boolean;
  message?: string;
  bonusCredits?: number;
}

/**
 * Generate a deterministic referral code for a user based on their username or device ID.
 */
export function generateReferralCode(username: string): string {
  // Simple hashing or truncation for a 6-character code
  const cleanName = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const suffix = Math.floor(Math.random() * 900 + 100); // 3 random digits
  return `${cleanName.substring(0, 3)}${suffix}`;
}

/**
 * Initialize or get a user's referral code document in Firestore.
 */
export async function initializeUserReferral(username: string, referralCode: string) {
  try {
    const userRef = doc(db, 'referrals', referralCode);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        owner: username,
        uses: 0,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Firebase initialization error', error);
  }
}

/**
 * Validates and applies a referral code entered by the current user.
 */
export async function applyReferralCode(codeToApply: string, currentUser: string): Promise<ReferralResult> {
  try {
    const code = codeToApply.trim().toUpperCase();
    
    // Quick validation
    if (!code || code.length < 4) {
      return { success: false, message: 'Invalid referral code.' };
    }

    const referralDocRef = doc(db, 'referrals', code);
    const snap = await getDoc(referralDocRef);

    if (!snap.exists()) {
      return { success: false, message: 'Referral code not found.' };
    }

    const data = snap.data();
    if (data.owner === currentUser) {
      return { success: false, message: 'You cannot use your own referral code.' };
    }

    // Check if current user already used a code (needs a separate collection to track users, simplifying for now)
    const userUsageRef = doc(db, 'referral_usage', currentUser);
    const usageSnap = await getDoc(userUsageRef);
    if (usageSnap.exists()) {
      return { success: false, message: 'You have already used a referral code.' };
    }

    // Mark as used
    await setDoc(userUsageRef, {
      usedCode: code,
      usedAt: new Date().toISOString()
    });

    // Increment owner's uses
    await updateDoc(referralDocRef, {
      uses: increment(1)
    });

    return { 
      success: true, 
      message: 'Code applied successfully!',
      bonusCredits: 5 
    };

  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to apply code.' };
  }
}
