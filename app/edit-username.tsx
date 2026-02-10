// app/edit-username.tsx
import FormInput from "@/components/FormInput";
import { updateDisplayName } from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditUsernameScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }

    if (username.trim().length < 2) {
      Alert.alert("Error", "Nama minimal 2 karakter");
      return;
    }

    if (username.trim().length > 20) {
      Alert.alert("Error", "Nama maksimal 20 karakter");
      return;
    }

    setLoading(true);
    try {
      const result = await updateDisplayName(username.trim());
      if (result.success) {
        refreshUser();
        Alert.alert("Sukses", "Nama berhasil diubah!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", result.error || "Gagal mengubah nama");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-secondary"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="h-32 px-6 pt-16 pb-6 bg-primary">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl pl-24 text-white font-poppins-semibold">
              Ubah Nama
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 mt-6">
          <Text className="mb-4 text-gray-600 font-poppins">
            Nama ini akan ditampilkan di profil Anda
          </Text>

          <FormInput
            placeholder="Masukkan nama baru"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />

          <Text className="mt-2 mb-6 text-xs text-gray-500 font-poppins">
            * Nama minimal 2 karakter, maksimal 20 karakter
          </Text>

          {/* Button */}
          <TouchableOpacity
            className="py-4 mt-4 rounded-full bg-primary"
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-poppins-bold text-[16px]">
                Simpan
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
