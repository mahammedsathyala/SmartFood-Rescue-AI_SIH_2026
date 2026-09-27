import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";

// Web app Firebase configuration
// Supports Vite environment variables with graceful fallback to project credentials
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7VchI86396956859DemoKeySIH2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartfood-rescue-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartfood-rescue-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartfood-rescue-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "86396956859",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:86396956859:web:daa396f63a353ce132b99e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WBWCX7W49D"
};

// Detect if running with valid live production credentials vs. local placeholder demo keys
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes('DemoKey') &&
  !firebaseConfig.apiKey.includes('your_api_key') &&
  !firebaseConfig.apiKey.includes('your_') &&
  firebaseConfig.apiKey.startsWith('AIza') &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('your_project_id')
);

// Initialize Firebase App safely (guards against missing env or HMR duplication)
function initApp(): FirebaseApp {
  try {
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (err) {
    console.warn("Firebase App initialization notice:", err);
    return initializeApp({
      apiKey: "AIzaSyC7VchI86396956859DemoKeySIH2026",
      projectId: "smartfood-rescue-ai"
    });
  }
}

export const app: FirebaseApp = initApp();

// Initialize Firebase Authentication safely
function initAuth(): Auth {
  try {
    return getAuth(app);
  } catch (err) {
    console.warn("Firebase Auth initialization notice:", err);
    return {} as Auth;
  }
}
export const auth: Auth = initAuth();

// Initialize Cloud Firestore database safely
function initFirestore(): Firestore {
  try {
    return getFirestore(app);
  } catch (err) {
    console.warn("Cloud Firestore initialization notice:", err);
    return {} as Firestore;
  }
}
export const db: Firestore = initFirestore();

// Initialize Cloud Storage safely
function initStorage(): FirebaseStorage {
  try {
    return getStorage(app);
  } catch (err) {
    console.warn("Cloud Storage initialization notice:", err);
    return {} as FirebaseStorage;
  }
}
export const storage: FirebaseStorage = initStorage();

// Initialize Firebase Cloud Functions safely
function initFunctions(): Functions {
  try {
    return getFunctions(app);
  } catch (err) {
    console.warn("Firebase Cloud Functions initialization notice:", err);
    return {} as Functions;
  }
}
export const functions: Functions = initFunctions();

// Initialize Analytics safely (guards against SSR, placeholder keys, strict ad-blockers, or unsupported browser environments)
export const analyticsPromise = (typeof window !== "undefined" && isFirebaseConfigured)
  ? isSupported().then((supported) => (supported ? getAnalytics(app) : null)).catch(() => null)
  : Promise.resolve(null);

export default app;

