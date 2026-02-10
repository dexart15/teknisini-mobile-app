import { db } from "@/config/firebase.config";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    updateDoc,
    where,
} from "firebase/firestore";

export interface Technician {
  id: string;
  name: string;
  category: string;
  location: string;
  photoURL?: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  skills: string[];
  available: boolean;
  phone?: string;
  email?: string;
  experience?: number;
  createdAt: string;
  updatedAt: string;
}

// Get all technicians
export const getAllTechnicians = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "technicians"));
    const technicians = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Technician[];
    return { success: true, data: technicians };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get technician by ID
export const getTechnicianById = async (id: string) => {
  try {
    const docRef = doc(db, "technicians", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        data: { id: docSnap.id, ...docSnap.data() } as Technician,
      };
    } else {
      return { success: false, error: "Technician not found" };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get technicians by category
export const getTechniciansByCategory = async (category: string) => {
  try {
    const q = query(
      collection(db, "technicians"),
      where("category", "==", category),
      where("available", "==", true),
      orderBy("rating", "desc")
    );
    const querySnapshot = await getDocs(q);
    const technicians = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Technician[];
    return { success: true, data: technicians };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Search technicians
export const searchTechnicians = async (searchQuery: string) => {
  try {
    // Get all technicians and filter client-side
    // Firestore doesn't support full-text search natively
    const result = await getAllTechnicians();

    if (result.success && result.data) {
      const filtered = result.data.filter((tech) => {
        const query = searchQuery.toLowerCase();
        return (
          tech.name.toLowerCase().includes(query) ||
          tech.category.toLowerCase().includes(query) ||
          tech.location.toLowerCase().includes(query) ||
          tech.description.toLowerCase().includes(query) ||
          tech.skills.some((skill) => skill.toLowerCase().includes(query))
        );
      });
      return { success: true, data: filtered };
    }

    return { success: false, error: "Failed to search technicians" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Filter technicians
export const filterTechnicians = async (filters: {
  category?: string;
  minRating?: number;
  maxPrice?: number;
  location?: string;
  available?: boolean;
}) => {
  try {
    let constraints: QueryConstraint[] = [];

    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }

    if (filters.available !== undefined) {
      constraints.push(where("available", "==", filters.available));
    }

    if (filters.minRating) {
      constraints.push(where("rating", ">=", filters.minRating));
    }

    // Add ordering
    constraints.push(orderBy("rating", "desc"));

    const q = query(collection(db, "technicians"), ...constraints);
    const querySnapshot = await getDocs(q);
    let technicians = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Technician[];

    // Client-side filtering for fields that Firestore can't handle
    if (filters.maxPrice) {
      technicians = technicians.filter(
        (tech) => tech.price <= filters.maxPrice!
      );
    }

    if (filters.location) {
      technicians = technicians.filter((tech) =>
        tech.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return { success: true, data: technicians };
  } catch (error: any) {
    console.error("filterTechnicians error:", error.message);
    
    // Fallback: Get all technicians and filter client-side if index not available
    try {
      const allResult = await getAllTechnicians();
      if (allResult.success && allResult.data) {
        let technicians = allResult.data;
        
        // Apply filters client-side
        if (filters.available !== undefined) {
          technicians = technicians.filter((tech) => tech.available === filters.available);
        }
        if (filters.category) {
          technicians = technicians.filter((tech) => tech.category === filters.category);
        }
        if (filters.minRating) {
          technicians = technicians.filter((tech) => tech.rating >= filters.minRating!);
        }
        if (filters.maxPrice) {
          technicians = technicians.filter((tech) => tech.price <= filters.maxPrice!);
        }
        if (filters.location) {
          technicians = technicians.filter((tech) =>
            tech.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        
        // Sort by rating
        technicians.sort((a, b) => b.rating - a.rating);
        
        return { success: true, data: technicians };
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }
    
    return { success: false, error: error.message };
  }
};

// Add new technician (for admin)
export const addTechnician = async (
  technicianData: Omit<Technician, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const docRef = await addDoc(collection(db, "technicians"), {
      ...technicianData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update technician
export const updateTechnician = async (
  id: string,
  data: Partial<Technician>
) => {
  try {
    const docRef = doc(db, "technicians", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete technician
export const deleteTechnician = async (id: string) => {
  try {
    const docRef = doc(db, "technicians", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get top rated technicians
export const getTopRatedTechnicians = async (limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, "technicians"),
      where("available", "==", true),
      orderBy("rating", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const technicians = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Technician[];
    return { success: true, data: technicians };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
