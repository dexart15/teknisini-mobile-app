// app/signup.tsx
import FormInput from "@/components/FormInput";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

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
      <FormInput placeholder="Alamat Email" />
      <FormInput placeholder="Kata Sandi" secureTextEntry />
      <FormInput placeholder="Konfirmasi Kata Sandi" secureTextEntry />

      {/* Daftar Button */}
      <TouchableOpacity className="bg-primary py-3 rounded-full mt-6">
        <Text className="text-center text-white font-poppins-bold text-[16px]">
          Daftar
        </Text>
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
