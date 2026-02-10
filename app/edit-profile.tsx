// app/edit-profile.tsx
import { updatePhotoURL } from "@/services/profileService";
import { uploadImage } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      // Set profile image
      if (user.photoURL) {
        setProfileImage(user.photoURL);
      }
      // Set username dari displayName atau email
      setUsername(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user]);

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name: string): string => {
    const cleanName = name.trim();
    if (cleanName.length === 0) return "U";
    const firstChar = cleanName[0].toUpperCase();
    const lastChar = cleanName[cleanName.length - 1].toUpperCase();
    return firstChar + lastChar;
  };

  // Mask email untuk keamanan
  const maskEmail = (email: string): string => {
    const [username, domain] = email.split("@");
    if (username.length <= 2) return email;
    const masked = username[0] + "*****" + username[username.length - 1];
    return `${masked}@${domain}`;
  };

  // Mask phone number
  const maskPhone = (phone: string): string => {
    if (!phone || phone.length < 4) return phone || "-";
    return "*".repeat(phone.length - 2) + phone.slice(-2);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Kami memerlukan izin untuk mengakses galeri foto Anda"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Terjadi kesalahan saat memilih foto");
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    if (!user) return;

    setUploading(true);
    try {
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;
      const uploadResult = await uploadImage(imageUri, "profiles", filename);

      if (uploadResult.success && uploadResult.url) {
        const updateResult = await updatePhotoURL(uploadResult.url);

        if (updateResult.success) {
          setProfileImage(uploadResult.url);
          refreshUser();
          Alert.alert("Sukses", "Foto profil berhasil diubah!");
        } else {
          Alert.alert("Error", "Gagal mengupdate foto profil");
        }
      } else {
        Alert.alert("Error", "Gagal mengupload foto");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const initials = getInitials(username || "User");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-secondary"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-6 bg-white">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="chevron-back" size={24} color="#32A4FF" />
            </TouchableOpacity>
            <Text className="text-xl font-poppins-bold flex-1 text-center pr-8">
              Ubah Profil
            </Text>
          </View>
        </View>

        {/* Profile Photo Section */}
        <View className="bg-primary py-8 items-center">
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <View className="relative">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-24 h-24 rounded-full border-4 border-white"
                />
              ) : (
                <View className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 items-center justify-center">
                  <Text className="text-2xl font-poppins-bold text-gray-600">
                    {initials}
                  </Text>
                </View>
              )}
              
              {uploading ? (
                <View className="absolute bottom-0 right-0 bg-white rounded-full p-2">
                  <ActivityIndicator size="small" color="#32A4FF" />
                </View>
              ) : (
                <View className="absolute bottom-0 right-0 bg-white rounded-full p-2">
                  <Ionicons name="pencil" size={16} color="#32A4FF" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View className="bg-white mt-2">
          {/* Username */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
            onPress={() => router.push("/edit-username" as any)}
          >
            <Text className="text-gray-600 font-poppins">Nama</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-poppins mr-2">{username}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
            onPress={() => router.push("/change-email" as any)}
          >
            <Text className="text-gray-600 font-poppins">Email</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-poppins mr-2">
                {user?.email ? maskEmail(user.email) : "-"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Phone (readonly) */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="text-gray-600 font-poppins">No. Handphone</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-poppins mr-2">
                {maskPhone(user?.phoneNumber || "")}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
