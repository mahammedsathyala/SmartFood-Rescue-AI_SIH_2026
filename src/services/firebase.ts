import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app Firebase configuration
// Supports Vite environment variables with graceful fallback to project credentials
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7VchI6xN-b9CD7C7U_9yscoOccpdO1RM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartfood-rescue-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartfood-rescue-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartfood-rescue-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "86396956859",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:86396956859:web:daa396f63a353ce132b99e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WBWCX7W49D"
};

// Initialize Firebase App (prevents re-initialization on Vite HMR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore database
export const db = getFirestore(app);

// Initialize Cloud Storage (for batch food images, inspection slips, receipts)
export const storage = getStorage(app);

// Initialize Analytics safely (guards against SSR, strict ad-blockers, or unsupported browser environments)
export const analyticsPromise = typeof window !== "undefined"
  ? isSupported().then((supported) => (supported ? getAnalytics(app) : null)).catch(() => null)
  : Promise.resolve(null);

export default app;
