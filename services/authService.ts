import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

// Sign up dengan email dan password
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile dengan nama
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Kirim email verifikasi
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Kirim ulang email verifikasi
export const resendVerificationEmail = async () => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: "User not logged in" };
    }
    await sendEmailVerification(auth.currentUser);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Cek apakah email sudah diverifikasi
export const isEmailVerified = () => {
  return auth.currentUser?.emailVerified || false;
};

// Reload user untuk update status verifikasi
export const reloadUser = async () => {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return { success: true, user: auth.currentUser };
    }
    return { success: false, error: "User not logged in" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login dengan email dan password
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Observer untuk auth state changes
export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
