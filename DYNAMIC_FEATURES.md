# Dynamic Features - Firebase Integration

This document explains all the dynamic features implemented using Firebase Firestore in the TeknisiNi app.

## 🔥 Firebase Services

### 1. Authentication Service (`services/authService.ts`)

Handles user authentication and account management:

- ✅ User registration with email/password
- ✅ User login
- ✅ Logout
- ✅ Password reset
- ✅ Change password
- ✅ Auto-login with persisted state

### 2. Profile Service (`services/profileService.ts`)

Manages user profile data:

- ✅ Update display name
- ✅ Upload profile photo to Firebase Storage
- ✅ Change password
- ✅ Fetch user profile data

### 3. Technician Service (`services/technicianService.ts`)

Manages technician data and search:

- ✅ Get all technicians
- ✅ Get technician by ID
- ✅ Filter by category
- ✅ Search by name/location/skills
- ✅ Filter by availability, rating, price range
- ✅ Get top-rated technicians

### 4. Favorite Service (`services/favoriteService.ts`)

Manages user favorites:

- ✅ Add/remove favorites
- ✅ Toggle favorite status
- ✅ Get user's favorite technicians
- ✅ Check if technician is favorited

### 5. Booking Service (`services/bookingService.ts`)

Manages booking/order system:

- ✅ Create new booking
- ✅ Get user bookings
- ✅ Update booking status
- ✅ Get ongoing bookings
- ✅ Get completed bookings
- ✅ Cancel booking

## 📱 Dynamic Screens

### Home Screen (`app/(tabs)/home.tsx`)

**Dynamic Features:**

- ✅ Loads technicians from Firestore
- ✅ Real-time search functionality
- ✅ Filter by category
- ✅ Toggle favorites (synced with Firestore)
- ✅ Loading states and empty states
- ✅ Pull-to-refresh

**Implementation:**

```typescript
- Fetches all technicians on mount
- Search updates as user types
- Category filter applies instantly
- Favorite toggle updates both UI and Firestore
```

### Search Screen (`app/(tabs)/search.tsx`)

**Dynamic Features:**

- ✅ Search by location and category
- ✅ Dynamic category filtering
- ✅ Shows nearby technicians
- ✅ Search results with count
- ✅ Favorite toggle integration

**Implementation:**

```typescript
- Location input filters by city
- Category selection filters results
- "Cari Teknisi" button triggers search
- Shows relevant results based on filters
```

### Favorite Screen (`app/(tabs)/favorite.tsx`)

**Dynamic Features:**

- ✅ Displays favorited technicians from Firestore
- ✅ Filter favorites by category
- ✅ Remove favorites
- ✅ Empty state when no favorites
- ✅ Pull-to-refresh
- ✅ Auth check (login required)

**Implementation:**

```typescript
- Fetches user's favorite IDs from Firestore
- Loads full technician data for each favorite
- Category filter works on favorites list
- Toggle removes from favorites instantly
```

### Orders Screen (`app/orders/index.tsx`)

**Dynamic Features:**

- ✅ Displays user bookings from Firestore
- ✅ Tabs for "Ongoing" and "Completed"
- ✅ Shows technician info with each booking
- ✅ Real-time booking status
- ✅ Pull-to-refresh
- ✅ Auth check required

**Implementation:**

```typescript
- Fetches bookings for logged-in user
- Enriches booking data with technician info
- Filters by status (pending/confirmed/in-progress vs completed/cancelled)
- Updates when booking status changes
```

### Profile Screen (`app/(tabs)/profile.tsx`)

**Dynamic Features:**

- ✅ Displays user info from Firebase Auth
- ✅ Upload profile photo
- ✅ Change password navigation
- ✅ Logout functionality
- ✅ Dynamic profile header

**Implementation:**

```typescript
- Shows current user's name and email
- Photo upload to Firebase Storage
- Password change redirects to dedicated screen
- Logout clears auth state
```

## 🗄️ Firestore Collections

### users

```typescript
{
  uid: string;           // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### technicians

```typescript
{
  id: string;            // Auto-generated
  name: string;
  category: string;      // Kelistrikan, Elektronik, Jaringan, Komputer, Otomotif
  location: string;
  photoURL?: string;
  rating: number;        // 0-5
  price: number;         // Rupiah
  skills: string[];
  available: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### favorites

```typescript
{
  id: string; // Auto-generated
  userId: string; // References users.uid
  technicianId: string; // References technicians.id
  addedAt: Date;
}
```

### bookings

```typescript
{
  id: string;            // Auto-generated
  userId: string;        // References users.uid
  technicianId: string;  // References technicians.id
  service: string;
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  notes?: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Getting Started

### 1. Firebase Setup

Ensure your `.env` file has Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Seed Initial Data

Run the seeding script to populate Firestore:

```bash
npx ts-node scripts/seedFirestore.ts
```

### 3. Test the App

```bash
npx expo start
```

## 🔒 Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Technicians collection
    match /technicians/{technicianId} {
      allow read: if true; // Public read
      allow write: if false; // Only admin can write (set via Firebase Console)
    }

    // Favorites collection
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## ✅ Features Completed

- ✅ User Authentication (signup, login, logout)
- ✅ Profile Management (photo upload, change password)
- ✅ Dynamic Technician Listings
- ✅ Search and Filter Functionality
- ✅ Favorites Management
- ✅ Booking System
- ✅ Order History
- ✅ Protected Routes
- ✅ Loading States
- ✅ Error Handling
- ✅ Pull-to-Refresh

## 🔄 Data Flow

1. **User Authentication Flow:**

   ```
   Login → Firebase Auth → authStore (Zustand) → AsyncStorage
   ```

2. **Technician Display Flow:**

   ```
   Component Mount → technicianService → Firestore Query → Update State → Render
   ```

3. **Favorite Toggle Flow:**

   ```
   User Click → favoriteService → Add/Remove from Firestore → Update Local State → UI Update
   ```

4. **Booking Creation Flow:**
   ```
   Form Submit → bookingService → Create in Firestore → Navigate to Success Screen
   ```

## 📝 Next Steps (Optional Enhancements)

- [ ] Add real-time listeners for live updates
- [ ] Implement push notifications
- [ ] Add booking confirmation system
- [ ] Create admin panel for technician management
- [ ] Add rating and review system
- [ ] Implement payment gateway
- [ ] Add chat/messaging feature
- [ ] Location-based search with maps
- [ ] Advanced filtering options
- [ ] Analytics dashboard

## 🐛 Troubleshooting

**Problem:** Data not loading

- Check Firebase credentials in `.env`
- Verify Firestore rules allow read access
- Check console for error messages

**Problem:** Authentication not working

- Ensure Firebase Authentication is enabled in console
- Verify email/password provider is active
- Check auth state in authStore

**Problem:** Images not displaying

- Ensure Firebase Storage is configured
- Check Storage rules allow read access
- Verify photoURL fields have valid URLs

**Problem:** Seeding script fails

- Run from project root: `npx ts-node scripts/seedFirestore.ts`
- Check Firebase admin permissions
- Verify collection names match exactly
