// app/verify-email.tsx
import {
    isEmailVerified,
    logout,
    reloadUser,
    resendVerificationEmail,
} from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer untuk resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto check verification setiap 5 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await reloadUser();
      if (result.success && isEmailVerified()) {
        clearInterval(interval);
        Alert.alert(
          "Email Terverifikasi!",
          "Akun Anda sudah terverifikasi. Selamat datang di TekniSini!",
          [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckVerification = async () => {
    setChecking(true);
    const result = await reloadUser();
    setChecking(false);

    if (result.success && isEmailVerified()) {
      Alert.alert(
        "Email Terverifikasi!",
        "Akun Anda sudah terverifikasi. Selamat datang di TekniSini!",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
      );
    } else {
      Alert.alert(
        "Belum Terverifikasi",
        "Email Anda belum terverifikasi. Silakan cek inbox atau spam folder Anda."
      );
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setResending(true);
    const result = await resendVerificationEmail();
    setResending(false);

    if (result.success) {
      setCountdown(60); // 60 detik cooldown
      Alert.alert("Sukses", "Email verifikasi telah dikirim ulang");
    } else {
      let errorMessage = "Gagal mengirim ulang email verifikasi";
      if (result.error?.includes("too-many-requests")) {
        errorMessage = "Terlalu banyak percobaan. Silakan tunggu beberapa saat";
        setCountdown(60);
      }
      Alert.alert("Gagal", errorMessage);
    }
  };

  const handleChangeEmail = async () => {
    Alert.alert(
      "Ganti Email?",
      "Anda akan logout dan perlu mendaftar ulang dengan email yang berbeda.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/signup");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-secondary px-6 justify-center items-center">
      {/* Icon */}
      <View className="bg-primary/10 rounded-full p-6 mb-6">
        <Ionicons name="mail-unread-outline" size={64} color="#32A4FF" />
      </View>

      {/* Title */}
      <Text className="text-2xl font-poppins-bold text-black mb-2 text-center">
        Verifikasi Email Anda
      </Text>
      <Text className="text-gray-600 font-poppins text-center mb-2">
        Kami telah mengirimkan email verifikasi ke
      </Text>
      <Text className="text-primary font-poppins-semibold text-center mb-6">
        {email}
      </Text>

      {/* Instructions */}
      <View className="bg-white rounded-xl p-4 mb-6 w-full">
        <Text className="text-gray-700 font-poppins-medium mb-3">
          Langkah verifikasi:
        </Text>
        <View className="flex-row items-start mb-2">
          <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mr-3">
            <Text className="text-white font-poppins-bold text-xs">1</Text>
          </View>
          <Text className="text-gray-600 font-poppins flex-1">
            Buka email dari TekniSini di inbox Anda
          </Text>
        </View>
        <View className="flex-row items-start mb-2">
          <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mr-3">
            <Text className="text-white font-poppins-bold text-xs">2</Text>
          </View>
          <Text className="text-gray-600 font-poppins flex-1">
            Klik link verifikasi di dalam email
          </Text>
        </View>
        <View className="flex-row items-start">
          <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mr-3">
            <Text className="text-white font-poppins-bold text-xs">3</Text>
          </View>
          <Text className="text-gray-600 font-poppins flex-1">
            Kembali ke aplikasi dan klik tombol di bawah
          </Text>
        </View>
      </View>

      {/* Check Verification Button */}
      <TouchableOpacity
        className="bg-primary py-3 rounded-full w-full mb-4"
        onPress={handleCheckVerification}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-poppins-bold text-[16px]">
            Saya Sudah Verifikasi
          </Text>
        )}
      </TouchableOpacity>

      {/* Resend Email */}
      <TouchableOpacity
        className={`py-3 rounded-full w-full border ${
          countdown > 0 ? "border-gray-300" : "border-primary"
        }`}
        onPress={handleResendEmail}
        disabled={resending || countdown > 0}
      >
        {resending ? (
          <ActivityIndicator color="#32A4FF" />
        ) : (
          <Text
            className={`text-center font-poppins-semibold text-[16px] ${
              countdown > 0 ? "text-gray-400" : "text-primary"
            }`}
          >
            {countdown > 0
              ? `Kirim Ulang (${countdown}s)`
              : "Kirim Ulang Email"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View className="flex-row items-center mt-6 px-4">
        <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
        <Text className="text-gray-500 font-poppins text-xs ml-2 flex-1">
          Tidak menerima email? Cek folder spam atau kirim ulang
        </Text>
      </View>

      {/* Change Email */}
      <TouchableOpacity className="mt-4" onPress={handleChangeEmail}>
        <Text className="text-gray-600 font-poppins-medium text-sm">
          Email salah?{" "}
          <Text className="text-primary font-poppins-semibold">
            Daftar dengan email lain
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
