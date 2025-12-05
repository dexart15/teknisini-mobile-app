import { db } from "@/config/firebase.config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  technicianId: string;
  technicianName: string;
  technicianCategory: string;
  technicianPhotoURL?: string;
  service: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  address: string;
  notes?: string;
  price: number;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all bookings for a user
export const getUserBookings = async (userId: string) => {
  try {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    // Sort in memory instead of using orderBy in query
    bookings.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // desc order
    });

    return { success: true, data: bookings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  try {
    const docRef = doc(db, "bookings", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        data: { id: docSnap.id, ...docSnap.data() } as Booking,
      };
    } else {
      return { success: false, error: "Booking not found" };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get bookings by status
export const getBookingsByStatus = async (
  userId: string,
  status: BookingStatus
) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    // Sort in memory instead of using orderBy in query
    bookings.sort((a, b) => {
      const dateA = new Date(a.scheduledDate).getTime();
      const dateB = new Date(b.scheduledDate).getTime();
      return dateB - dateA; // desc order
    });

    return { success: true, data: bookings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Create new booking
export const createBooking = async (
  bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update booking status
export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
) => {
  try {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update booking
export const updateBooking = async (id: string, data: Partial<Booking>) => {
  try {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Cancel booking
export const cancelBooking = async (id: string) => {
  try {
    return await updateBookingStatus(id, "cancelled");
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get ongoing bookings
export const getOngoingBookings = async (userId: string) => {
  try {
    const statuses: BookingStatus[] = ["pending", "confirmed", "in-progress"];
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      where("status", "in", statuses)
    );
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    // Sort in memory instead of using orderBy in query
    bookings.sort((a, b) => {
      const dateA = new Date(a.scheduledDate).getTime();
      const dateB = new Date(b.scheduledDate).getTime();
      return dateA - dateB; // asc order
    });

    return { success: true, data: bookings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get completed bookings
export const getCompletedBookings = async (userId: string) => {
  try {
    return await getBookingsByStatus(userId, "completed");
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update booking rating and review
export const updateBookingRating = async (
  id: string,
  rating: number,
  review: string
) => {
  try {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, {
      rating,
      review,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
