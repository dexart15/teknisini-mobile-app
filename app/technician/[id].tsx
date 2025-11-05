import IconActionButton from "@/components/IconActionButton";
import ReviewCard from "@/components/ReviewCard";
import { technicians } from "@/data/technicians";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function TechnicianDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const technician = technicians.find((t) => t.id === Number(id));

  if (!technician) return null;

  return (
    <View className="flex-1 bg-[#E6F4FF]">
      <View>
        {/* Header */}
        <View className="bg-primary py-12">
          <TouchableOpacity onPress={() => router.back()} className="p-4 mt-4">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Technician Detail */}
        <View className="items-center mt-[-50]">
            <Image
              source={technician.image}
              className="w-32 h-32 rounded-full border-2 border-primary bg-white"
            />
            <Text className="mt-3 text-black text-xl font-poppins-semibold">
              {technician.name}
            </Text>
            <Text className="text-grayText text-lg font-poppins">
              Teknisi {technician.category}
            </Text>
          </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center mt-4">
          <IconActionButton icon="call-outline" label="Telepon" />
          <IconActionButton icon="chatbubble-ellipses-outline" label="Pesan" />
          <IconActionButton icon="mail-outline" label="Email" />
        </View>

        {/* About */}
        <View className="px-6 mt-4">
          <Text className="text-gray-700 text-justify leading-6 font-[Poppins]">
            {technician.description}
          </Text>
        </View>

        {/* Gallery */}
        <View className="px-6 mt-4">
          <Text className="text-lg font-[Poppins-SemiBold] text-gray-900 mb-2">
            Galeri
          </Text>
          <View className="flex-row justify-between">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                source={require("@/assets/images/sample-gallery.jpg")}
                className="w-[8.2rem] h-24"
              />
            ))}
          </View>
        </View>

        {/* Review */}
        <View className="px-6 mt-4 mb-24">
          <Text className="text-lg font-[Poppins-SemiBold] text-gray-900 mb-2">
            Ulasan
          </Text>
          <ReviewCard
            name="Wisnu Caksono"
            rating={5.0}
            time="5 jam lalu"
            review={`${technician.name} adalah teknisi ${technician.category.toLowerCase()} yang berpengalaman, andal, dan teliti. Selalu memberikan layanan berkualitas tinggi dan aman.`}
          />
        </View>
      </View>

      {/* Bottom button */}
      <View className="absolute bottom-0 w-full px-6 pt-4 pb-12 bg-white">
      <TouchableOpacity className="bg-primary py-4 rounded-full">
        <Text className="text-center text-white font-poppins-semibold text-[16px]"
        
        >
          Pesan Sekarang
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
