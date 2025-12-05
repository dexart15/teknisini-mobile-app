# Firebase Authentication Integration

## 📱 Fitur yang Sudah Diimplementasikan

### 1. **Login Screen** (`app/login.tsx`)

- ✅ Email dan password input dengan validasi
- ✅ Loading state saat proses login
- ✅ Error handling dengan pesan yang user-friendly
- ✅ Auto redirect ke home setelah login berhasil
- ✅ Integrasi dengan Firebase Authentication

### 2. **Signup Screen** (`app/signup.tsx`)

- ✅ Registrasi dengan email dan password
- ✅ Validasi password (minimal 6 karakter)
- ✅ Konfirmasi password
- ✅ Auto-save user data ke Firestore
- ✅ Loading state dan error handling
- ✅ Auto redirect ke home setelah registrasi berhasil

### 3. **Profile Screen** (`app/(tabs)/profile.tsx`)

- ✅ Menampilkan email user yang sedang login
- ✅ Tombol logout dengan konfirmasi
- ✅ Redirect ke login setelah logout

### 4. **Authentication State Management** (`store/authStore.ts`)

- ✅ Global state management dengan Zustand
- ✅ Auto-observe auth state changes
- ✅ Persistent authentication (tetap login setelah restart app)

### 5. **Protected Routes** (`hooks/useProtectedRoute.ts`)

- ✅ Auto redirect ke login jika belum login
- ✅ Auto redirect ke home jika sudah login tapi akses login/signup
- ✅ Melindungi semua halaman di dalam tabs

## 🔐 Cara Menggunakan

### Login

1. Buka aplikasi
2. Jika belum login, akan otomatis redirect ke halaman login
3. Masukkan email dan password
4. Tekan tombol "Masuk"
5. Akan otomatis redirect ke home jika berhasil

### Signup

1. Di halaman login, tap "Daftar"
2. Masukkan email, password, dan konfirmasi password
3. Password minimal 6 karakter
4. Tekan tombol "Daftar"
5. Akun akan dibuat dan data disimpan di Firestore
6. Auto redirect ke home setelah berhasil

### Logout

1. Pergi ke tab "Profile"
2. Tap menu "Logout"
3. Konfirmasi logout
4. Akan redirect ke halaman login

## 🗂️ Struktur File

```
app/
├── _layout.tsx                 # Initialize auth observer & protected routes
├── index.tsx                   # Splash screen dengan auto redirect
├── login.tsx                   # Login screen dengan Firebase auth
├── signup.tsx                  # Signup screen dengan Firebase auth
└── (tabs)/
    └── profile.tsx             # Profile dengan logout functionality

components/
└── FormInput.tsx               # Input component dengan controlled state

hooks/
└── useProtectedRoute.ts        # Custom hook untuk route protection

store/
├── authStore.ts                # Global auth state management
└── favoriteStore.ts            # (existing)

services/
├── authService.ts              # Firebase auth operations
├── firestoreService.ts         # Firestore CRUD operations
└── storageService.ts           # Firebase storage operations

config/
└── firebase.config.ts          # Firebase configuration
```

## 🔧 API Services

### Authentication Service (`services/authService.ts`)

```typescript
// Sign up
const result = await signUp(email, password, displayName);

// Login
const result = await login(email, password);

// Logout
await logout();

// Get current user
const user = getCurrentUser();

// Observe auth state
const unsubscribe = observeAuthState((user) => {
  console.log("User:", user);
});

// Reset password
await resetPassword(email);
```

### Firestore Service (`services/firestoreService.ts`)

```typescript
// Get all documents
const result = await getAllDocuments("users");

// Get document by ID
const result = await getDocumentById("users", userId);

// Add document
const result = await addDocument("users", data);

// Update document
await updateDocument("users", userId, data);

// Delete document
await deleteDocument("users", userId);

// Query with filters
import { where, orderBy } from "firebase/firestore";
const result = await queryDocuments("orders", [
  where("userId", "==", userId),
  orderBy("createdAt", "desc"),
]);
```

## 🎨 User Flow

### First Time User

```
Splash Screen (2s)
  ↓
Login Screen
  ↓ (tap "Daftar")
Signup Screen
  ↓ (register)
Home Screen (logged in)
```

### Returning User (Not Logged In)

```
Splash Screen (2s)
  ↓
Login Screen
  ↓ (login)
Home Screen
```

### Returning User (Already Logged In)

```
Splash Screen (2s)
  ↓
Home Screen (auto-login)
```

## 🛡️ Security Features

1. **Route Protection**: Halaman yang memerlukan authentication akan otomatis redirect ke login
2. **Password Security**: Password di-hash oleh Firebase Authentication
3. **Auto Logout**: Ketika user logout, session langsung dihapus
4. **Persistent Login**: User tetap login setelah close/restart app
5. **Error Handling**: Semua error dari Firebase ditangani dengan user-friendly messages

## 📝 Error Messages

| Error Code             | Pesan ke User                                     |
| ---------------------- | ------------------------------------------------- |
| `invalid-credential`   | Email atau password salah                         |
| `user-not-found`       | Email atau password salah                         |
| `invalid-email`        | Format email tidak valid                          |
| `email-already-in-use` | Email sudah terdaftar                             |
| `weak-password`        | Password terlalu lemah                            |
| `too-many-requests`    | Terlalu banyak percobaan. Silakan coba lagi nanti |

## 🔄 State Management

### Auth Store (`store/authStore.ts`)

```typescript
const {
  user, // Current user object (null if not logged in)
  loading, // Loading state
  initialized, // Whether auth observer is initialized
  setUser, // Set user manually
  logout, // Logout function
  initialize, // Initialize auth observer
} = useAuthStore();
```

### Usage in Components

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View>
      <Text>Email: {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## 🚀 Next Steps (Optional Enhancements)

- [ ] Implement "Forgot Password" functionality
- [ ] Add Google Sign-In
- [ ] Add Facebook Sign-In
- [ ] Add phone number authentication
- [ ] Add email verification
- [ ] Add profile picture upload
- [ ] Add edit profile functionality
- [ ] Add change password functionality
- [ ] Add biometric authentication (Face ID/Touch ID)
- [ ] Add session timeout
- [ ] Add remember me feature

## 🧪 Testing

### Test Login

1. Buat akun baru melalui signup
2. Logout
3. Login dengan akun yang sama
4. Pastikan redirect ke home
5. Cek data user di Firestore console

### Test Signup

1. Gunakan email baru
2. Test dengan password < 6 karakter (should fail)
3. Test dengan password tidak match (should fail)
4. Test dengan email yang sudah terdaftar (should fail)
5. Test dengan data valid (should success)

### Test Route Protection

1. Logout dari aplikasi
2. Coba akses home dengan deep link (should redirect to login)
3. Login
4. Coba akses login page (should redirect to home)

### Test Persistent Login

1. Login ke aplikasi
2. Close aplikasi
3. Buka aplikasi lagi
4. Pastikan tetap login (auto redirect ke home)

## 🐛 Troubleshooting

### "Permission denied" error

- Pastikan Firestore rules sudah di-setup dengan benar
- Pastikan user sudah authenticated

### "Network request failed"

- Cek koneksi internet
- Pastikan Firebase project masih aktif

### User tidak auto-login setelah restart

- Pastikan auth observer sudah di-initialize di `_layout.tsx`
- Cek apakah `initialized` state sudah true

### Redirect loop

- Cek logic di `useProtectedRoute.ts`
- Pastikan segments detection sudah benar
