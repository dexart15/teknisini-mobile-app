import { auth } from "@/config/firebase.config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { updateDocument } from "./firestoreService";

// Update display name
export const updateDisplayName = async (displayName: string) => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: "User not logged in" };
    }

    await updateProfile(auth.currentUser, { displayName });

    // Update di Firestore juga
    await updateDocument("users", auth.currentUser.uid, { displayName });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update profile photo URL
export const updatePhotoURL = async (photoURL: string) => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: "User not logged in" };
    }

    await updateProfile(auth.currentUser, { photoURL });

    // Update di Firestore juga
    await updateDocument("users", auth.currentUser.uid, { photoURL });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Change password dengan re-authentication
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, error: "User not logged in" };
    }

    // Re-authenticate user terlebih dahulu
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update password
    await updatePassword(auth.currentUser, newPassword);

    return { success: true };
  } catch (error: any) {
    let errorMessage = "Terjadi kesalahan saat mengubah password";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      errorMessage = "Password lama salah";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password baru terlalu lemah (minimal 6 karakter)";
    } else if (error.code === "auth/requires-recent-login") {
      errorMessage = "Silakan login ulang sebelum mengubah password";
    }

    return { success: false, error: errorMessage };
  }
};

// Get user profile dari Firestore
export const getUserProfile = async (userId: string) => {
  try {
    const { getDocumentById } = await import("./firestoreService");
    const result = await getDocumentById("users", userId);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: "Profile not found" };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
