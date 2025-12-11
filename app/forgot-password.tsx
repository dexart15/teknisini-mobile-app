// app/forgot-password.tsx
import FormInput from "@/components/FormInput";
import { resetPassword } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Mohon masukkan alamat email");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      setEmailSent(true);
    } else {
      let errorMessage = "Terjadi kesalahan saat mengirim email";
      if (result.error?.includes("user-not-found")) {
        errorMessage = "Email tidak terdaftar";
      } else if (result.error?.includes("invalid-email")) {
        errorMessage = "Format email tidak valid";
      } else if (result.error?.includes("too-many-requests")) {
        errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti";
      }
      Alert.alert("Gagal", errorMessage);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert("Sukses", "Email reset password telah dikirim ulang");
    } else {
      Alert.alert("Gagal", "Gagal mengirim ulang email. Coba lagi nanti");
    }
  };

  if (emailSent) {
    return (
      <View className="flex-1 bg-secondary px-6 justify-center items-center">
        {/* Success Icon */}
        <View className="bg-primary/10 rounded-full p-6 mb-6">
          <Ionicons name="mail-outline" size={64} color="#32A4FF" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-poppins-bold text-black mb-2 text-center">
          Cek Email Anda
        </Text>
        <Text className="text-gray-600 font-poppins text-center mb-6 px-4">
          Kami telah mengirimkan link reset password ke{"\n"}
          <Text className="text-primary font-poppins-semibold">{email}</Text>
        </Text>

        {/* Instructions */}
        <View className="bg-white rounded-xl p-4 mb-6 w-full">
          <Text className="text-gray-700 font-poppins-medium mb-2">
            Langkah selanjutnya:
          </Text>
          <View className="flex-row items-start mb-2">
            <Text className="text-primary font-poppins-bold mr-2">1.</Text>
            <Text className="text-gray-600 font-poppins flex-1">
              Buka email dari TekniSini
            </Text>
          </View>
          <View className="flex-row items-start mb-2">
            <Text className="text-primary font-poppins-bold mr-2">2.</Text>
            <Text className="text-gray-600 font-poppins flex-1">
              Klik link reset password
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary font-poppins-bold mr-2">3.</Text>
            <Text className="text-gray-600 font-poppins flex-1">
              Buat password baru Anda
            </Text>
          </View>
        </View>

        {/* Resend Button */}
        <TouchableOpacity
          className="mb-4"
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#32A4FF" />
          ) : (
            <Text className="text-primary font-poppins-semibold">
              Tidak menerima email? Kirim ulang
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          className="bg-primary py-3 px-8 rounded-full"
          onPress={() => router.replace("/login")}
        >
          <Text className="text-white font-poppins-bold text-[16px]">
            Kembali ke Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-6 justify-center">
        {/* Back Button */}
        <TouchableOpacity
          className="absolute top-16 left-6"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#32A4FF" />
        </TouchableOpacity>

        {/* Icon */}
        <View className="items-center mb-6">
          <View className="bg-primary/10 rounded-full p-6">
            <Ionicons name="lock-closed-outline" size={48} color="#32A4FF" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-poppins-bold text-black mb-2 text-center">
          Lupa Kata Sandi?
        </Text>
        <Text className="text-gray-600 font-poppins text-center mb-8">
          Masukkan email yang terdaftar untuk menerima{"\n"}link reset password
        </Text>

        {/* Email Input */}
        <FormInput
          placeholder="Alamat Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Reset Button */}
        <TouchableOpacity
          className="bg-primary py-3 rounded-full mt-6"
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white font-poppins-bold text-[16px]">
              Kirim Link Reset
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        {/* <TouchableOpacity
          className="mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-center text-primary font-poppins-semibold">
            Kembali ke Login
          </Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
}
