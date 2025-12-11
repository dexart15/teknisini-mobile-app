// app/login.tsx
import FormInput from "@/components/FormInput";
import { isEmailVerified, login } from "@/services/authService";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password");
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      // Skip verifikasi untuk admin
      const isAdmin = email.trim().toLowerCase() === "admin@admin.com";
      
      // Cek apakah email sudah diverifikasi (kecuali admin)
      if (!isAdmin && !isEmailVerified()) {
        Alert.alert(
          "Email Belum Diverifikasi",
          "Silakan verifikasi email Anda terlebih dahulu untuk melanjutkan.",
          [
            { text: "Verifikasi Email", onPress: () => router.replace("/verify-email") },
          ]
        );
        return;
      }
      
      Alert.alert("Sukses", "Login berhasil!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } else {
      let errorMessage = "Terjadi kesalahan saat login";
      if (
        result.error?.includes("invalid-credential") ||
        result.error?.includes("user-not-found")
      ) {
        errorMessage = "Email atau password salah";
      } else if (result.error?.includes("invalid-email")) {
        errorMessage = "Format email tidak valid";
      } else if (result.error?.includes("too-many-requests")) {
        errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti";
      }
      Alert.alert("Login Gagal", errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-secondary px-6 justify-center">
      {/* Title */}
      <Text className="text-3xl font-poppins-bold text-primary mb-1">
        TekniSini.
      </Text>
      <Text className="text-2xl font-poppins-bold text-black mb-8">
        Masuk Akun
      </Text>

      {/* Input Fields */}
      <FormInput
        placeholder="Alamat Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormInput
        placeholder="Kata Sandi"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity 
        className="items-end mt-2"
        onPress={() => router.push("/forgot-password")}
      >
        <Text className="text-[13px] text-primary font-poppins-semibold">
          Lupa Kata Sandi
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-primary py-3 rounded-full mt-6"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-poppins-bold text-[16px]">
            Masuk
          </Text>
        )}
      </TouchableOpacity>

      {/* OR Divider */}
      <Text className="text-center text-gray-500 mt-6 mb-3 font-poppins-medium">
        atau Masuk dengan
      </Text>

      {/* Social Buttons */}
      <View className="flex-row justify-center gap-8">
        <Image
          source={require("../assets/images/google.png")}
          className="w-16 h-16 bg-white rounded-full"
        />
        <Image
          source={require("../assets/images/facebook.png")}
          className="w-16 h-16 bg-white rounded-full"
        />
      </View>

      {/* Footer Link */}
      <View className="flex-row justify-center mt-10">
        <Text className="font-poppins-medium text-gray-700">
          Belum memiliki akun?{" "}
        </Text>
        <Link href="/signup" className="text-primary font-poppins-bold">
          Daftar
        </Link>
      </View>
    </View>
  );
}
