import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase.config";

// Get semua dokumen dari collection
export const getAllDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get dokumen berdasarkan ID
export const getDocumentById = async (
  collectionName: string,
  documentId: string
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Document not found" };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Query documents dengan filter
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[]
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Tambah dokumen baru (auto-generated ID)
export const addDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Set dokumen dengan ID spesifik
export const setDocument = async (
  collectionName: string,
  documentId: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: documentId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update dokumen
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete dokumen
export const deleteDocument = async (
  collectionName: string,
  documentId: string
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Example: Get technicians by category
export const getTechniciansByCategory = async (category: string) => {
  return queryDocuments("technicians", [
    where("category", "==", category),
    orderBy("rating", "desc"),
    limit(10),
  ]);
};

// Example: Get user orders
export const getUserOrders = async (userId: string) => {
  return queryDocuments("orders", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ]);
};
