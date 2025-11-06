import { orders } from "@/data/orders";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RatingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const order = orders.find((o) => o.id == Number(id));

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    Alert.alert(
      "Ulasan terkirim!",
      "Terima kasih telah memberikan ulasan.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ],
      { cancelable: false }
    );
  };

  if (!order) return null;

  return (
    <View className="flex-1 bg-secondary">
      <View className="bg-white pt-12 pb-8 flex-row items-center border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="px-4 mt-4">
        <Ionicons name="arrow-back" size={24} color="#32A4FF" />
        </TouchableOpacity>
        <Text className="ml-[5.5rem] mt-4 text-2xl font-poppins-bold text-black">
        Pesanan Saya
        </Text>
      </View>

      {/* Technician */}
      <View className="bg-white rounded-xl p-4 m-5 shadow">
        <View className="flex-row items-center">
          <Image source={order.technician.image} className="w-14 h-14 rounded-full mr-3" />
          <View>
            <Text className="font-poppins-medium">{order.technician.name}</Text>
            <Text className="text-gray-500 text-[12px]">{order.service}</Text>
          </View>
        </View>

        {/* Rating */}
        <Text className="mt-4 mb-2 text-gray-800 font-poppins">
          Nilai Layanan
        </Text>
        <View className="flex-row mb-3 gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={32}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Review */}
        <Text className="mt-2 mb-2 text-gray-800 font-poppins">
          Tulis ulasan minimal 10 karakter
        </Text>
        <TextInput
          className="bg-gray-100 rounded-xl p-3 h-[25rem] mb-6"
          multiline
          value={review}
          onChangeText={setReview}
        />
      </View>

      {/* Bottom button */}
      <View className="absolute bottom-0 w-full px-6 pt-4 pb-12 bg-white">
        <TouchableOpacity
          className="bg-primary py-3 rounded-full items-center"
          onPress={handleSubmit}
          >
          <Text className="text-white font-poppins-medium">Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
