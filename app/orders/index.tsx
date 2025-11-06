import OrderCard from "@/components/OrderCard";
import { orders } from "@/data/orders";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OrdersScreen() {
  const [tab, setTab] = useState<"ongoing" | "completed">("ongoing");
  const router = useRouter();

  const filtered = orders.filter((order) =>
    tab === "ongoing"
      ? order.status === "ongoing"
      : order.status !== "ongoing"
  );

  return (
    <View className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-white pt-12 pb-8 flex-row items-center border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="px-4 mt-4">
        <Ionicons name="arrow-back" size={24} color="#32A4FF" />
        </TouchableOpacity>
        <Text className="ml-[5.5rem] mt-4 text-2xl font-poppins-bold text-black">
        Pesanan Saya
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around bg-white">
        {["ongoing", "completed"].map((item) => (
          <TouchableOpacity key={item} onPress={() => setTab(item as any)}>
            <Text
              className={`px-3 py-3 ${
                tab === item ? "text-primary font-poppins-semibold" : "text-grayText font-poppins-medium"
              }`}
            >
              {item === "ongoing" ? "Sedang Berjalan" : "Selesai"}
            </Text>
            {tab === item && <View className="h-[2px] bg-primary w-full rounded-full" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* List Pesanan */}
      <ScrollView className="mt-3 px-4">
        {filtered.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </ScrollView>
    </View>
  );
}
