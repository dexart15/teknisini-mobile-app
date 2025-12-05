import ProfileMenuItem from "@/components/ProfileMenuItem";
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
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load profile image dari user photoURL
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    }
  }, [user?.photoURL]);

  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Kami memerlukan izin untuk mengakses galeri foto Anda"
        );
        return;
      }

      // Launch image picker
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
      // Upload image ke Firebase Storage
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;
      const uploadResult = await uploadImage(imageUri, "profiles", filename);

      if (uploadResult.success && uploadResult.url) {
        // Update photoURL di Firebase Auth
        const updateResult = await updatePhotoURL(uploadResult.url);

        if (updateResult.success) {
          setProfileImage(uploadResult.url);
          refreshUser(); // Refresh user data di store
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

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Keluar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-primary h-48 px-6 flex-row items-center justify-between pt-16">
        <View>
          <Text className="text-white text-xl font-poppins-semibold">
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="mail" size={16} color="white" />
            <Text className="text-white text-sm ml-1 font-poppins">
              {user?.email || "email@example.com"}
            </Text>
          </View>
        </View>
        <View className="relative">
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("@/assets/images/avatar.jpg")
            }
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full"
            onPress={pickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#32A4FF" />
            ) : (
              <Ionicons name="pencil" size={14} color="#32A4FF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu List */}
      <View className="mt-6">
        <Text className="text-2xl font-poppins-medium text-black px-6 mb-2">
          Akun Saya
        </Text>

        <ProfileMenuItem
          title="Pesanan Saya"
          onPress={() => router.push("/orders" as any)}
        />
        <ProfileMenuItem
          title="Teknisi Favorit"
          onPress={() => router.push("/(tabs)/favorite")}
        />
        <ProfileMenuItem
          title="Ubah Kata Sandi"
          onPress={() => router.push("/change-password" as any)}
        />
        <ProfileMenuItem title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}
