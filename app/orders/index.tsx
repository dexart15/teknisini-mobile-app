import OrderCard from "@/components/OrderCard";
import { Booking, getUserBookings } from "@/services/bookingService";
import { getTechnicianById } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const [tab, setTab] = useState<"ongoing" | "completed">("ongoing");
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserBookings(user.uid);

      if (!result.success || !result.data) {
        console.error("Failed to load bookings:", result.error);
        setBookings([]);
        return;
      }

      // Enrich bookings with technician data
      const enrichedBookings = await Promise.all(
        result.data.map(async (booking) => {
          try {
            const techResult = await getTechnicianById(booking.technicianId);
            return {
              ...booking,
              technicianName:
                techResult.success && techResult.data
                  ? techResult.data.name
                  : booking.technicianName || "Unknown",
              technicianPhoto:
                techResult.success && techResult.data
                  ? techResult.data.photoURL
                  : booking.technicianPhotoURL || "",
            };
          } catch (error) {
            console.error("Error fetching technician:", error);
            return {
              ...booking,
              technicianName: booking.technicianName || "Unknown",
              technicianPhoto: booking.technicianPhotoURL || "",
            };
          }
        })
      );
      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const filtered = bookings.filter((booking) => {
    if (tab === "ongoing") {
      return ["pending", "confirmed", "in-progress"].includes(booking.status);
    } else {
      return ["completed", "cancelled"].includes(booking.status);
    }
  });

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
                tab === item
                  ? "text-primary font-poppins-semibold"
                  : "text-grayText font-poppins-medium"
              }`}
            >
              {item === "ongoing" ? "Sedang Berjalan" : "Selesai"}
            </Text>
            {tab === item && (
              <View className="h-[2px] bg-primary w-full rounded-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List Pesanan */}
      <ScrollView
        className="mt-3 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!user ? (
          <View className="py-20 items-center">
            <Text className="text-gray-600 font-poppins text-center">
              Silakan login untuk melihat pesanan Anda
            </Text>
          </View>
        ) : loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#32A4FF" />
            <Text className="text-gray-500 font-poppins mt-2">
              Memuat pesanan...
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="py-20 items-center">
            <Text className="text-gray-600 font-poppins text-center">
              {tab === "ongoing"
                ? "Tidak ada pesanan yang sedang berjalan"
                : "Tidak ada pesanan yang selesai"}
            </Text>
          </View>
        ) : (
          filtered.map((booking) => (
            <OrderCard
              key={booking.id}
              {...booking}
              hasRating={!!booking.rating}
              onStatusChange={loadBookings}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
