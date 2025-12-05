import IconActionButton from "@/components/IconActionButton";
import ReviewCard from "@/components/ReviewCard";
import { isFavorite, toggleFavorite } from "@/services/favoriteService";
import { getTechnicianById, Technician } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import { formatRupiah } from "@/utils/formatRupiah";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TechnicianDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    loadTechnician();
  }, [id]);

  const loadTechnician = async () => {
    try {
      setLoading(true);
      const result = await getTechnicianById(id as string);
      console.log("Technician data loaded:", result);

      if (!result.success || !result.data) {
        Alert.alert(
          "Error",
          "Data teknisi tidak ditemukan. Pastikan sudah melakukan seeding database."
        );
        setLoading(false);
        return;
      }

      setTechnician(result.data);

      if (user) {
        const favResult = await isFavorite(user.uid, id as string);
        if (favResult.success) {
          setFavorite(favResult.isFavorite);
        }
      }
    } catch (error) {
      console.error("Error loading technician:", error);
      Alert.alert("Error", "Gagal memuat data teknisi");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert("Login Required", "Silakan login untuk menambahkan favorit");
      return;
    }

    try {
      await toggleFavorite(user.uid, id as string);
      setFavorite(!favorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Gagal mengupdate favorit");
    }
  };

  const handleBooking = () => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Silakan login terlebih dahulu untuk melakukan pemesanan",
        [
          { text: "Batal", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") },
        ]
      );
      return;
    }
    router.push(`/order/detail?id=${id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#E6F4FF] items-center justify-center">
        <ActivityIndicator size="large" color="#32A4FF" />
        <Text className="text-gray-500 font-poppins mt-2">Memuat data...</Text>
      </View>
    );
  }

  if (!technician) {
    return (
      <View className="flex-1 bg-[#E6F4FF] items-center justify-center">
        <Text className="text-gray-500 font-poppins">
          Teknisi tidak ditemukan
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-2 rounded-full"
        >
          <Text className="text-white font-poppins-semibold">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#E6F4FF]">
      <ScrollView>
        {/* Header */}
        <View className="bg-primary py-12">
          <View className="flex-row items-center justify-between px-4 mt-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorite}>
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Technician Detail */}
        <View className="items-center mt-[-50]">
          <Image
            source={
              technician.photoURL
                ? { uri: technician.photoURL }
                : require("@/assets/images/avatar.jpg")
            }
            className="w-32 h-32 rounded-full border-2 border-primary bg-white"
          />
          <Text className="mt-3 text-black text-xl font-poppins-semibold">
            {technician.name}
          </Text>
          <Text className="text-grayText text-lg font-poppins">
            Teknisi {technician.category}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-700 font-poppins">
              {technician.rating?.toFixed(1) || "N/A"}
            </Text>
            <Text className="mx-2 text-gray-400">•</Text>
            <Text className="text-primary font-poppins-semibold">
              {formatRupiah(technician.price || 0)}/jam
            </Text>
          </View>
          {!technician.available && (
            <View className="bg-red-100 px-4 py-1 rounded-full mt-2">
              <Text className="text-red-600 font-poppins text-sm">
                Tidak Tersedia
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center mt-4">
          <IconActionButton icon="call-outline" label="Telepon" />
          <IconActionButton icon="chatbubble-ellipses-outline" label="Pesan" />
          <IconActionButton icon="mail-outline" label="Email" />
        </View>

        {/* Location */}
        <View className="px-6 mt-4">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700 font-poppins">
              {technician.location}
            </Text>
          </View>
        </View>

        {/* Skills */}
        {technician.skills && technician.skills.length > 0 && (
          <View className="px-6 mt-4">
            <Text className="text-lg font-poppins-semibold text-gray-900 mb-2">
              Keahlian
            </Text>
            <View className="flex-row flex-wrap">
              {technician.skills.map((skill, index) => (
                <View
                  key={index}
                  className="bg-primary/10 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-primary font-poppins text-sm">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* About */}
        {technician.description && (
          <View className="px-6 mt-4">
            <Text className="text-lg font-poppins-semibold text-gray-900 mb-2">
              Tentang
            </Text>
            <Text className="text-gray-700 text-justify leading-6 font-poppins">
              {technician.description}
            </Text>
          </View>
        )}

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
            review={`${technician.name} adalah teknisi ${technician.category?.toLowerCase() || "profesional"} yang berpengalaman, andal, dan teliti. Selalu memberikan layanan berkualitas tinggi dan aman.`}
          />
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View className="absolute bottom-0 w-full px-6 pt-4 pb-12 bg-white">
        <TouchableOpacity
          className={`py-4 rounded-full ${
            technician.available ? "bg-primary" : "bg-gray-400"
          }`}
          onPress={handleBooking}
          disabled={!technician.available}
        >
          <Text className="text-center text-white font-poppins-semibold text-[16px]">
            {technician.available ? "Pesan Sekarang" : "Tidak Tersedia"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
