import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { name, category, location, service, total } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-secondary justify-around items-center px-6">
      {/* Tombol Close */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home")}
        className="absolute top-14 right-6"
      >
        <Ionicons name="close-outline" size={32} color="gray" />
      </TouchableOpacity>

      <View className="flex-col items-center">
        {/* Icon Success */}
        <View className="w-24 h-24 bg-primary rounded-full justify-center items-center mb-6">
          <Ionicons name="checkmark" size={56} color="white" />
        </View>

        {/* Teks utama */}
        <Text className="text-2xl font-poppins-bold text-gray-900 mb-0.5">
          Pemesanan Berhasil!
        </Text>
        <Text className="text-grayText font-poppins text-sm mb-6">
          {new Date().toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}{" "}
          WITA
        </Text>
      </View>

      {/* Kartu Detail Pesanan */}
      <View className="bg-white rounded-2xl p-6 w-full shadow-md">
        <Text className="text-softGrayText text-xs text-center mb-1">Teknisi</Text>
        <Text className="text-gray-900 font-poppins-bold text-2xl text-center">
          {name || "Mahendra Saputra"}
        </Text>
        <Text className="text-grayText text-center">
          {category || "Kelistrikan"}{" "}
        </Text>
        <Text className="text-grayText text-xs text-center mb-4">
          {location ? `${location}` : "Denpasar, Bali"}
        </Text>

        <Text className="text-softGrayText text-xs text-center mb-1">Layanan</Text>
        <Text className="text-gray-800 text-center font-poppins-medium mb-3">
          {service || "Perbaikan lampu ruang tidur"}
        </Text>

        <Text className="text-softGrayText text-xs text-center mb-1">
          Total Biaya Layanan
        </Text>
        <Text className="text-primary text-center text-[20px] font-poppins-semibold">
          Rp{Number(total || 145000).toLocaleString("id-ID")}
        </Text>
      </View>
    </View>
  );
}
