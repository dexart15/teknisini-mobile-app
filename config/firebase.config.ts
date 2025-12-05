import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables (via app.config.js)
// Fallback ke hardcoded values jika environment variables tidak tersedia
const firebaseConfig = {
  apiKey:
    Constants.expoConfig?.extra?.firebaseApiKey ||
    "AIzaSyAK_44aNkabiKXnGCgstTyXhU_jwe2xe3g",
  authDomain:
    Constants.expoConfig?.extra?.firebaseAuthDomain ||
    "teknisini.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "teknisini",
  storageBucket:
    Constants.expoConfig?.extra?.firebaseStorageBucket ||
    "teknisini.firebasestorage.app",
  messagingSenderId:
    Constants.expoConfig?.extra?.firebaseMessagingSenderId || "530657301346",
  appId:
    Constants.expoConfig?.extra?.firebaseAppId ||
    "1:530657301346:web:d596dd0b5148c95d87923b",
  measurementId:
    Constants.expoConfig?.extra?.firebaseMeasurementId || "G-2MMFZPVERM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// Firebase Auth will automatically persist in Expo
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
