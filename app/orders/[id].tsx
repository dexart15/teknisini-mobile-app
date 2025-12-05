import { getBookingById, updateBookingRating } from "@/services/bookingService";
import { getTechnicianById } from "@/services/technicianService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Booking {
  id: string;
  userId: string;
  technicianId: string;
  serviceName: string;
  servicePrice: number;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  status: string;
  createdAt: string;
  rating?: number;
  review?: string;
}

interface Technician {
  id: string;
  name: string;
  category: string;
  photo: string;
  rating: number;
  experience: string;
  location: string;
  price: number;
  description: string;
}

export default function RatingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, [id]);

  const loadBookingData = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);
      const bookingResult = await getBookingById(id);

      if (bookingResult.success && bookingResult.data) {
        setBooking(bookingResult.data as Booking);

        // Load technician data
        const techResult = await getTechnicianById(
          bookingResult.data.technicianId
        );
        if (techResult.success && techResult.data) {
          setTechnician(techResult.data as Technician);
        }

        // Set existing rating if available
        if (bookingResult.data.rating) {
          setRating(bookingResult.data.rating);
        }
        if (bookingResult.data.review) {
          setReview(bookingResult.data.review);
        }
      }
    } catch (error) {
      console.error("Error loading booking:", error);
      Alert.alert("Error", "Gagal memuat data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Perhatian", "Silakan berikan rating terlebih dahulu");
      return;
    }

    if (review.length < 10) {
      Alert.alert("Perhatian", "Ulasan minimal 10 karakter");
      return;
    }

    if (!id || typeof id !== "string") return;

    try {
      setSubmitting(true);
      const result = await updateBookingRating(id, rating, review);

      if (result.success) {
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
      } else {
        Alert.alert("Error", result.error || "Gagal mengirim ulasan");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim ulasan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-secondary justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-gray-600">Memuat data pesanan...</Text>
      </View>
    );
  }

  if (!booking || !technician) {
    return (
      <View className="flex-1 bg-secondary justify-center items-center">
        <Text className="text-lg font-poppins-bold">
          Pesanan tidak ditemukan
        </Text>
      </View>
    );
  }

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
          <Image
            source={{ uri: technician.photo }}
            className="w-14 h-14 rounded-full mr-3"
          />
          <View>
            <Text className="font-poppins-medium">{technician.name}</Text>
            <Text className="text-gray-500 text-[12px]">
              {booking.serviceName}
            </Text>
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
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-poppins-medium">Kirim</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
