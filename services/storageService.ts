import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
  UploadMetadata,
} from "firebase/storage";
import { storage } from "../config/firebase.config";

// Upload file ke Firebase Storage
export const uploadFile = async (
  file: Blob,
  path: string,
  metadata?: UploadMetadata
) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL, snapshot };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Upload file dengan progress tracking
export const uploadFileWithProgress = (
  file: Blob,
  path: string,
  onProgress: (progress: number) => void,
  metadata?: UploadMetadata
) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        reject({ success: false, error: error.message });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ success: true, url: downloadURL });
        } catch (error: any) {
          reject({ success: false, error: error.message });
        }
      }
    );
  });
};

// Get download URL dari path
export const getFileURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete file dari Storage
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// List semua file di folder
export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);

    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url,
        };
      })
    );

    return { success: true, files };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Upload image (helper function)
export const uploadImage = async (
  imageUri: string,
  folder: string,
  filename: string
) => {
  try {
    // Fetch image as blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const path = `${folder}/${filename}`;
    return uploadFile(blob, path, {
      contentType: blob.type,
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
