import ReviewCard from "@/components/ReviewCard";
import { getBookingsByTechnicianId } from "@/services/bookingService";
import { getUserProfile } from "@/services/profileService";
import { getTechnicianById, Technician } from "@/services/technicianService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load technician data
      const techResult = await getTechnicianById(id as string);
      if (techResult.success && techResult.data) {
        setTechnician(techResult.data);
      }

      // Load reviews from bookings
      const bookingsResult = await getBookingsByTechnicianId(id as string);
      if (bookingsResult.success && bookingsResult.data) {
        const reviewsWithRatings = await Promise.all(
          bookingsResult.data
            .filter((booking) => booking.rating && booking.review)
            .map(async (booking) => {
              // Get user profile to extract name from email
              let userName = "Pengguna";
              try {
                const userResult = await getUserProfile(booking.userId);
                if (userResult.success && userResult.data) {
                  const userData = userResult.data as { email?: string };
                  if (userData.email) {
                    userName = userData.email.split("@")[0];
                  }
                }
              } catch (e) {
                console.log("Error fetching user:", e);
              }
              
              return {
                id: booking.id,
                userId: booking.userId,
                userName,
                rating: booking.rating!,
                review: booking.review!,
                createdAt: booking.updatedAt,
              };
            })
        );
        setReviews(reviewsWithRatings);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      Alert.alert("Error", "Gagal memuat ulasan");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Baru saja";
    } else if (diffInHours < 1) {
      return `${diffInMinutes} menit lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <View className="flex-1 bg-secondary items-center justify-center">
        <ActivityIndicator size="large" color="#32A4FF" />
        <Text className="text-gray-500 font-poppins mt-2">
          Memuat ulasan...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 border-b border-gray-200">
        <View className="flex-row items-center px-4 mt-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#32A4FF" />
          </TouchableOpacity>
          <Text className="ml-[6.5rem] text-2xl font-poppins-bold text-black">
            Ulasan Teknisi
          </Text>
        </View>

        {/* Rating Summary */}
        {technician && (
          <View className="px-6 mt-4">
            <Text className="text-lg font-poppins-semibold text-gray-900">
              {technician.name}
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text className="ml-2 text-2xl font-poppins-bold text-gray-900">
                {averageRating}
              </Text>
              <Text className="ml-2 text-gray-600 font-poppins">
                ({reviews.length} ulasan)
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Reviews List */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        {reviews.length === 0 ? (
          <View className="py-20 items-center">
            <Ionicons name="chatbubble-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-600 font-poppins text-center mt-4">
              Belum ada ulasan untuk teknisi ini
            </Text>
          </View>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.userName}
              rating={review.rating}
              time={getTimeAgo(review.createdAt)}
              review={review.review}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}