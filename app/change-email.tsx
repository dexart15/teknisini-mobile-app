// app/change-email.tsx
import FormInput from "@/components/FormInput";
import { sendEmailUpdateLink } from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
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

export default function ChangeEmailScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerification = async () => {
    // Validasi
    if (!newEmail.trim()) {
      Alert.alert("Error", "Mohon isi email baru");
      return;
    }

    if (!validateEmail(newEmail.trim())) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      Alert.alert("Error", "Email baru harus berbeda dengan email saat ini");
      return;
    }

    if (!password) {
      Alert.alert("Error", "Mohon isi password untuk verifikasi");
      return;
    }

    setLoading(true);
    try {
      const result = await sendEmailUpdateLink(newEmail.trim(), password);

      if (result.success) {
        setEmailSent(true);
      } else {
        Alert.alert("Gagal", result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat mengirim email");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndLogin = async () => {
    await logout();
    router.replace("/login");
  };

  // Success screen after email sent
  if (emailSent) {
    return (
      <View className="flex-1 bg-secondary px-6 justify-center items-center">
        <View className="bg-white rounded-2xl p-8 items-center w-full">
          <View className="bg-green-100 rounded-full p-4 mb-4">
            <Ionicons name="mail-outline" size={48} color="#22C55E" />
          </View>
          
          <Text className="text-xl font-poppins-bold text-center mb-2">
            Email Verifikasi Terkirim!
          </Text>
          
          <Text className="text-gray-600 font-poppins text-center mb-6">
            Kami telah mengirim link verifikasi ke{"\n"}
            <Text className="font-poppins-semibold text-primary">{newEmail}</Text>
          </Text>

          <View className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
            <Text className="text-sm font-poppins text-gray-700 mb-2">
              📧 Langkah selanjutnya:
            </Text>
            <Text className="text-sm font-poppins text-gray-600 mb-1">
              1. Buka email baru Anda ({newEmail})
            </Text>
            <Text className="text-sm font-poppins text-gray-600 mb-1">
              2. Klik link verifikasi di email
            </Text>
            <Text className="text-sm font-poppins text-gray-600 mb-1">
              3. Email Anda akan otomatis berubah
            </Text>
            <Text className="text-sm font-poppins text-gray-600">
              4. Login kembali dengan email baru
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary py-3 px-6 rounded-full w-full mb-3"
            onPress={handleLogoutAndLogin}
          >
            <Text className="text-center text-white font-poppins-bold text-[16px]">
              Login dengan Email Baru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3"
            onPress={() => router.back()}
          >
            <Text className="text-center text-primary font-poppins-semibold">
              Kembali ke Profil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            <Text className="text-xl pl-20 text-white font-poppins-semibold">
              Ubah Email
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 mt-6">
          <Text className="mb-2 text-gray-800 font-poppins-semibold">
            Email Saat Ini
          </Text>
          <View className="bg-gray-100 rounded-full px-4 py-4 mb-4">
            <Text className="text-gray-500 font-poppins">{user?.email}</Text>
          </View>

          <Text className="mb-2 text-gray-800 font-poppins-semibold">
            Email Baru
          </Text>
          <FormInput
            placeholder="Masukkan email baru"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="mb-2 mt-4 text-gray-800 font-poppins-semibold">
            Password
          </Text>
          <FormInput
            placeholder="Masukkan password untuk verifikasi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text className="mt-2 mb-6 text-xs text-gray-500 font-poppins">
            * Masukkan password akun Anda untuk verifikasi keamanan
          </Text>

          {/* Button */}
          <TouchableOpacity
            className="py-4 mt-4 rounded-full bg-primary"
            onPress={handleSendVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-white font-poppins-bold text-[16px]">
                Kirim Link Verifikasi
              </Text>
            )}
          </TouchableOpacity>

          {/* Info */}
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
                  Cara Mengubah Email:
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Link verifikasi akan dikirim ke email baru
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Klik link tersebut untuk mengkonfirmasi
                </Text>
                <Text className="mb-1 text-sm text-gray-600 font-poppins">
                  • Setelah dikonfirmasi, email akan berubah
                </Text>
                <Text className="text-sm text-gray-600 font-poppins">
                  • Anda perlu login ulang dengan email baru
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
