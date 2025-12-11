import FormInput from "@/components/FormInput";
import { changePassword } from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validasi input
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Mohon isi semua field");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru dan konfirmasi tidak sama");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password baru minimal 6 karakter");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert("Error", "Password baru harus berbeda dengan password lama");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      Alert.alert("Sukses", "Password berhasil diubah!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Alert.alert("Gagal", result.error || "Terjadi kesalahan");
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
          <View className="flex-row  items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl pl-[5.5rem] text-white font-poppins-semibold">
              Ubah Kata Sandi
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 mt-6">
          <Text className="mb-4 text-gray-600 font-poppins">
            Silakan masukkan password lama dan password baru Anda
          </Text>

          <FormInput
            placeholder="Password Lama"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity 
            className="items-end mt-2 mb-4"
            onPress={() => router.push("/forgot-password")}
          >
            <Text className="text-[13px] text-primary font-poppins-semibold">
              Lupa Password Lama?
            </Text>
          </TouchableOpacity>

          <FormInput
            placeholder="Password Baru"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <FormInput
            placeholder="Konfirmasi Password Baru"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Text className="mt-2 mb-6 text-xs text-gray-500 font-poppins">
            * Password minimal 6 karakter
          </Text>

          {/* Button */}
          <TouchableOpacity
            className="py-4 mt-4 rounded-full bg-primary"
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-poppins-bold text-[16px]">
                Ubah Password
              </Text>
            )}
          </TouchableOpacity>

          {/* Tips */}
          <View className="p-4 mt-8 rounded-lg bg-blue-50">
            <View className="flex-row items-start mb-2">
              <Ionicons
                name="information-circle"
                size={20}
                color="#3B82F6"
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="mb-2 text-gray-800 font-poppins-semibold">
                  Tips Keamanan Password:
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Gunakan minimal 6 karakter
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Kombinasikan huruf besar dan kecil
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Tambahkan angka dan simbol
                </Text>
                <Text className="text-sm text-gray-600 font-poppins">
                  • Jangan gunakan password yang mudah ditebak
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
