# Firebase Integration - TeknisiNi Mobile App

## Setup Firebase

### 1. Install Dependencies

Firebase package sudah terinstall. Jika perlu install ulang:

```bash
npm install firebase
```

### 2. Konfigurasi Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda atau buat project baru
3. Pergi ke **Project Settings** > **General** > **Your apps**
4. Pilih atau tambahkan Web App
5. Copy konfigurasi Firebase

### 3. Update File Konfigurasi

Buka file `config/firebase.config.ts` dan ganti dengan konfigurasi Firebase Anda:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

### 4. Enable Firebase Services

Di Firebase Console, aktifkan services yang dibutuhkan:

#### Authentication

1. Pergi ke **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable provider lain seperti Google, Facebook, dll

#### Firestore Database

1. Pergi ke **Firestore Database**
2. Klik **Create database**
3. Pilih mode: **Start in test mode** (development) atau **Start in production mode**
4. Pilih lokasi server terdekat

#### Storage

1. Pergi ke **Storage**
2. Klik **Get started**
3. Pilih security rules sesuai kebutuhan

### 5. Firebase Security Rules

#### Firestore Rules (Development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write untuk authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules (Development)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write untuk authenticated users
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Struktur Database yang Disarankan

### Collections

#### users

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  phoneNumber: string,
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### technicians

```javascript
{
  id: string,
  name: string,
  category: string,
  rating: number,
  reviewCount: number,
  price: number,
  location: string,
  description: string,
  skills: array,
  photoURL: string,
  available: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### orders

```javascript
{
  id: string,
  userId: string,
  technicianId: string,
  technicianName: string,
  service: string,
  status: string, // pending, confirmed, in-progress, completed, cancelled
  date: timestamp,
  time: string,
  location: string,
  price: number,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### reviews

```javascript
{
  id: string,
  technicianId: string,
  userId: string,
  orderId: string,
  rating: number,
  comment: string,
  createdAt: timestamp
}
```

## Cara Menggunakan Services

### Authentication Service

```typescript
import { signUp, login, logout, getCurrentUser } from "./services/authService";

// Sign up
const result = await signUp("email@example.com", "password123", "Nama User");

// Login
const result = await login("email@example.com", "password123");

// Logout
await logout();

// Get current user
const user = getCurrentUser();
```

### Firestore Service

```typescript
import {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
} from "./services/firestoreService";

// Get all technicians
const result = await getAllDocuments("technicians");

// Get technician by ID
const result = await getDocumentById("technicians", "tech123");

// Add new order
const result = await addDocument("orders", {
  userId: "user123",
  technicianId: "tech123",
  service: "AC Repair",
  status: "pending",
  date: new Date(),
  price: 150000,
});

// Update order
await updateDocument("orders", "order123", { status: "completed" });

// Delete order
await deleteDocument("orders", "order123");
```

### Storage Service

```typescript
import { uploadImage, deleteFile, getFileURL } from "./services/storageService";

// Upload profile image
const result = await uploadImage(imageUri, "profiles", `${userId}_profile.jpg`);

// Get image URL
const result = await getFileURL("profiles/user123_profile.jpg");

// Delete image
await deleteFile("profiles/user123_profile.jpg");
```

## Testing

Untuk testing koneksi Firebase:

1. Pastikan konfigurasi sudah benar di `config/firebase.config.ts`
2. Jalankan app: `npm start`
3. Test authentication di halaman login/signup
4. Test Firestore dengan membaca/menulis data
5. Test Storage dengan upload image

## Troubleshooting

### Error: Firebase not initialized

- Pastikan `config/firebase.config.ts` sudah di-import di app entry point
- Periksa apakah semua konfigurasi sudah benar

### Error: Permission denied

- Periksa Firestore/Storage security rules
- Pastikan user sudah authenticated

### Error: Network request failed

- Periksa koneksi internet
- Periksa apakah Firebase project masih aktif

## Production Checklist

- [ ] Update security rules untuk production
- [ ] Simpan konfigurasi Firebase di environment variables
- [ ] Enable Firebase App Check untuk keamanan
- [ ] Setup Firebase Analytics
- [ ] Setup Firebase Crashlytics
- [ ] Enable backup untuk Firestore
- [ ] Review dan optimize Firebase quotas
