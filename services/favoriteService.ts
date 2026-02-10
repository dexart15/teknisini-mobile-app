import { db } from "@/config/firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export interface Favorite {
  id: string;
  userId: string;
  technicianId: string;
  addedAt: string;
}

// Get user favorites
export const getUserFavorites = async (userId: string) => {
  try {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const favorites = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Favorite[];
    return { success: true, data: favorites };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Check if technician is favorited
export const isFavorite = async (userId: string, technicianId: string) => {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("technicianId", "==", technicianId)
    );
    const querySnapshot = await getDocs(q);
    return { success: true, isFavorite: !querySnapshot.empty };
  } catch (error: any) {
    return { success: false, error: error.message, isFavorite: false };
  }
};

// Add to favorites
export const addToFavorites = async (userId: string, technicianId: string) => {
  try {
    // Check if already favorited
    const checkResult = await isFavorite(userId, technicianId);
    if (checkResult.isFavorite) {
      return { success: false, error: "Already in favorites" };
    }

    const docRef = await addDoc(collection(db, "favorites"), {
      userId,
      technicianId,
      addedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Remove from favorites
export const removeFromFavorites = async (
  userId: string,
  technicianId: string
) => {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("technicianId", "==", technicianId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Not in favorites" };
    }

    // Delete all matching documents (should only be one)
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Toggle favorite (add or remove)
export const toggleFavorite = async (userId: string, technicianId: string) => {
  try {
    const checkResult = await isFavorite(userId, technicianId);

    if (checkResult.isFavorite) {
      return await removeFromFavorites(userId, technicianId);
    } else {
      return await addToFavorites(userId, technicianId);
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get favorite technician IDs for a user
export const getFavoriteTechnicianIds = async (userId: string) => {
  try {
    const result = await getUserFavorites(userId);
    if (result.success && result.data) {
      const ids = result.data.map((fav) => fav.technicianId);
      return { success: true, data: ids };
    }
    return { success: false, error: "Failed to get favorite IDs" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
