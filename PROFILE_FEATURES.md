# 🎨 Profile Management Features

## ✨ Fitur yang Sudah Diimplementasikan

### 1. **Ubah Foto Profil**

Lokasi: Halaman Profile → Tap icon edit (pensil) di foto profil

**Cara Menggunakan:**

1. Buka tab **Profile**
2. Tap icon **pensil** pada foto profil
3. Pilih foto dari galeri
4. Crop foto (rasio 1:1)
5. Foto akan otomatis diupload ke Firebase Storage
6. Foto profil akan terupdate di seluruh aplikasi

**Teknologi:**

- `expo-image-picker` - Memilih foto dari galeri
- Firebase Storage - Menyimpan foto
- Firebase Auth - Update photoURL
- Firestore - Backup data photo URL

### 2. **Ubah Kata Sandi**

Lokasi: Halaman Profile → Menu "Ubah Kata Sandi"

**Cara Menggunakan:**

1. Buka tab **Profile**
2. Tap menu **"Ubah Kata Sandi"**
3. Masukkan password lama
4. Masukkan password baru (minimal 6 karakter)
5. Konfirmasi password baru
6. Tap tombol **"Ubah Password"**

**Validasi:**

- Semua field harus diisi
- Password lama harus benar
- Password baru minimal 6 karakter
- Password baru dan konfirmasi harus sama
- Password baru harus berbeda dari password lama

**Fitur Keamanan:**

- Re-authentication sebelum ubah password
- Password di-hash oleh Firebase
- Error messages yang user-friendly

## 📂 File yang Dibuat/Diubah

### ✨ File Baru

- `services/profileService.ts` - Service untuk profile management
- `app/change-password.tsx` - Halaman ubah password

### 🔧 File yang Dimodifikasi

- `app/(tabs)/profile.tsx` - Fitur upload foto profil
- `components/ProfileHeader.tsx` - Menampilkan foto profil dinamis
- `store/authStore.ts` - Menambah fungsi refreshUser
- `config/firebase.config.ts` - Update import

### 📦 Package yang Ditambahkan

- `expo-image-picker` - Memilih foto dari galeri
- `@react-native-async-storage/async-storage` - Local storage

## 🔧 API Services

### Profile Service (`services/profileService.ts`)

```typescript
import {
  updateDisplayName,
  updatePhotoURL,
  changePassword,
} from "@/services/profileService";

// Update display name
const result = await updateDisplayName("John Doe");

// Update photo URL
const result = await updatePhotoURL("https://example.com/photo.jpg");

// Change password (requires re-authentication)
const result = await changePassword("oldPassword123", "newPassword456");
```

### Storage Service (untuk upload foto)

```typescript
import { uploadImage } from "@/services/storageService";

// Upload foto profil
const result = await uploadImage(
  imageUri,
  "profiles",
  `profile_${userId}_${Date.now()}.jpg`
);

if (result.success) {
  console.log("Photo URL:", result.url);
}
```

## 🎨 User Flow

### Ubah Foto Profil

```
Profile Tab
  ↓ (tap icon pensil)
Permission Request (jika belum granted)
  ↓
Image Picker Gallery
  ↓ (pilih foto)
Crop & Preview
  ↓ (confirm)
Upload to Firebase Storage
  ↓
Update Auth photoURL
  ↓
Update Firestore user document
  ↓
Refresh UI (ProfileHeader & Profile Screen)
  ↓
Success Alert
```

### Ubah Kata Sandi

```
Profile Tab
  ↓ (tap "Ubah Kata Sandi")
Change Password Screen
  ↓ (isi form)
Validate Input
  ↓
Re-authenticate dengan password lama
  ↓
Update password di Firebase Auth
  ↓
Success Alert
  ↓
Back to Profile
```

## 🛡️ Security & Validation

### Ubah Foto Profil

- ✅ Permission check untuk akses galeri
- ✅ Image compression (quality: 0.5)
- ✅ Aspect ratio lock (1:1)
- ✅ Loading state saat upload
- ✅ Error handling untuk setiap step
- ✅ Unique filename dengan timestamp

### Ubah Kata Sandi

- ✅ Re-authentication wajib (verify password lama)
- ✅ Password minimal 6 karakter
- ✅ Validasi konfirmasi password
- ✅ Password baru harus berbeda dari yang lama
- ✅ Firebase Auth security rules

## 📝 Error Messages

### Ubah Foto Profil

| Error             | Pesan                                                   |
| ----------------- | ------------------------------------------------------- |
| Permission denied | "Kami memerlukan izin untuk mengakses galeri foto Anda" |
| Upload failed     | "Gagal mengupload foto"                                 |
| Update failed     | "Gagal mengupdate foto profil"                          |
| General error     | "Terjadi kesalahan saat memilih foto"                   |

### Ubah Kata Sandi

| Error Code                   | Pesan                                              |
| ---------------------------- | -------------------------------------------------- |
| `auth/wrong-password`        | "Password lama salah"                              |
| `auth/invalid-credential`    | "Password lama salah"                              |
| `auth/weak-password`         | "Password baru terlalu lemah (minimal 6 karakter)" |
| `auth/requires-recent-login` | "Silakan login ulang sebelum mengubah password"    |
| Validation error             | Custom messages (lihat validasi di atas)           |

## 🧪 Testing

### Test Ubah Foto Profil

1. **Setup:**
   - Login ke aplikasi
   - Pergi ke tab Profile

2. **Test Permission:**
   - Tap icon edit foto
   - Allow permission untuk gallery access
   - Verify permission granted

3. **Test Upload:**
   - Pilih foto dari galeri
   - Crop foto
   - Verify loading indicator muncul
   - Verify success alert
   - Verify foto terupdate di ProfileHeader dan Profile screen

4. **Test Error Handling:**
   - Test dengan koneksi internet off
   - Test dengan permission denied
   - Verify error messages sesuai

### Test Ubah Kata Sandi

1. **Test Validation:**
   - Submit dengan field kosong (should fail)
   - Submit dengan password < 6 char (should fail)
   - Submit dengan konfirmasi tidak match (should fail)
   - Submit dengan password sama (should fail)

2. **Test Wrong Password:**
   - Masukkan password lama yang salah
   - Verify error: "Password lama salah"

3. **Test Success:**
   - Masukkan password lama yang benar
   - Masukkan password baru valid
   - Konfirmasi password match
   - Submit
   - Verify success alert
   - Back to profile

4. **Test Login dengan Password Baru:**
   - Logout
   - Login dengan password baru
   - Verify login berhasil

## 💡 Tips & Best Practices

### Untuk User:

1. **Foto Profil:**
   - Gunakan foto dengan resolusi baik
   - Pastikan wajah terlihat jelas
   - Foto akan di-crop persegi (1:1)

2. **Password:**
   - Gunakan minimal 6 karakter
   - Kombinasikan huruf, angka, dan simbol
   - Jangan gunakan password yang mudah ditebak
   - Ganti password secara berkala

### Untuk Developer:

1. **Security:**
   - Foto disimpan di folder `/profiles/` di Firebase Storage
   - Filename unique dengan format: `profile_{uid}_{timestamp}.jpg`
   - Re-authentication required sebelum change password
   - Password tidak pernah disimpan plain text

2. **Performance:**
   - Image compression quality: 0.5 untuk mengurangi ukuran
   - Aspect ratio 1:1 untuk konsistensi
   - Loading states untuk UX yang baik

3. **Data Consistency:**
   - PhotoURL disimpan di Firebase Auth dan Firestore
   - refreshUser() dipanggil setelah update untuk sync state
   - Auth observer akan auto-update user state

## 🐛 Troubleshooting

### "Permission Denied" untuk Gallery

**Solusi:**

- Buka Settings → TeknisiNi → Photos
- Enable "Read and Write" atau "All Photos"

### Foto tidak terupdate setelah upload

**Solusi:**

- Pull to refresh di Profile screen
- Restart aplikasi
- Check Firebase Storage console untuk verify file uploaded

### "Password lama salah" padahal sudah benar

**Solusi:**

- Pastikan tidak ada spasi di awal/akhir
- Caps Lock mungkin aktif
- Coba forgot password jika lupa

### Upload foto stuck loading

**Solusi:**

- Check koneksi internet
- Coba foto dengan ukuran lebih kecil
- Restart aplikasi
- Check Firebase Storage quota

## 🔄 Firebase Storage Structure

```
storage/
└── profiles/
    ├── profile_uid1_1234567890.jpg
    ├── profile_uid1_1234567891.jpg (foto baru, foto lama tidak dihapus)
    ├── profile_uid2_1234567892.jpg
    └── ...
```

**Note:** Old photos tidak otomatis dihapus. Untuk production, tambahkan cleanup function.

## 🎯 Future Enhancements

- [ ] Hapus foto profil lama setelah upload foto baru
- [ ] Tambah fitur crop advanced
- [ ] Tambah fitur camera capture (bukan hanya gallery)
- [ ] Tambah validasi ukuran file (max 5MB)
- [ ] Tambah preview foto sebelum upload
- [ ] Tambah progress bar saat upload
- [ ] Tambah fitur edit display name
- [ ] Tambah forgot password di change password screen
- [ ] Tambah email verification
- [ ] Tambah 2FA (Two-Factor Authentication)

---

## 📱 Demo Flow

### Complete User Journey:

1. **Login** → Profile Tab
2. **Tap Edit Icon** → Gallery Permission → Select Photo
3. **Crop & Upload** → Success → Photo Updated Everywhere
4. **Tap "Ubah Kata Sandi"** → Fill Form
5. **Submit** → Success → Back to Profile
6. **Logout & Login** with new password → Success!

---

✅ **Fitur Profile Management sudah siap digunakan!**
