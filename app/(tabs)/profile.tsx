import ProfileMenuItem from "@/components/ProfileMenuItem";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-primary h-48 px-6 flex-row items-center justify-between pt-16">
        <View>
          <Text className="text-white text-xl font-poppins-semibold">
            Asep Mancing Gorgon
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location" size={20} color="white" />
            <Text className="text-white text-sm ml-1 font-poppins">
              Denpasar, Bali
            </Text>
          </View>
        </View>
        <View className="relative">
          <Image
            source={require("@/assets/images/avatar.jpg")}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <View className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
            <Ionicons name="pencil" size={14} color="#32A4FF" />
          </View>
        </View>
      </View>

      {/* Menu List */}
      <View className="mt-6">
        <Text className="text-2xl font-poppins-medium text-black px-6 mb-2">
          Akun Saya
        </Text>

        <ProfileMenuItem title="Pesanan Saya" />
        <ProfileMenuItem title="Teknisi Favorit" />
        <ProfileMenuItem title="Ubah Kata Sandi" />
        <ProfileMenuItem title="Logout" />
      </View>
    </View>
  );
}
