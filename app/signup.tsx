// app/signup.tsx
import FormInput from "@/components/FormInput";
import { db } from "@/config/firebase.config";
import { signUp } from "@/services/authService";
import { Link, useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validasi input
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Mohon isi semua field");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak sama");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password);

    if (result.success && result.user) {
      // Simpan data user ke Firestore
      try {
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.log("Error saving user data:", error);
      }

      setLoading(false);
      Alert.alert("Sukses", "Akun berhasil dibuat!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } else {
      setLoading(false);
      let errorMessage = "Terjadi kesalahan saat membuat akun";
      if (result.error?.includes("email-already-in-use")) {
        errorMessage = "Email sudah terdaftar";
      } else if (result.error?.includes("invalid-email")) {
        errorMessage = "Format email tidak valid";
      } else if (result.error?.includes("weak-password")) {
        errorMessage = "Password terlalu lemah";
      }
      Alert.alert("Registrasi Gagal", errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-secondary px-6 justify-center">
      {/* Title */}
      <Text className="text-3xl font-poppins-bold text-primary mb-1">
        TekniSini.
      </Text>
      <Text className="text-2xl font-poppins-bold text-black mb-8">
        Daftar Akun
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
      <FormInput
        placeholder="Konfirmasi Kata Sandi"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Daftar Button */}
      <TouchableOpacity
        className="bg-primary py-3 rounded-full mt-6"
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-poppins-bold text-[16px]">
            Daftar
          </Text>
        )}
      </TouchableOpacity>

      {/* OR Divider */}
      <Text className="text-center text-gray-500 mt-6 mb-3 font-poppins-medium">
        atau Daftar dengan
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
          Sudah memiliki akun?{" "}
        </Text>
        <Link href="/login" className="text-primary font-poppins-bold">
          Masuk
        </Link>
      </View>
    </View>
  );
}
