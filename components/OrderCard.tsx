import { updateBookingStatus } from "@/services/bookingService";
import { formatRupiah } from "@/utils/formatRupiah";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OrderCardProps {
  id: string;
  technicianId: string;
  technicianName?: string;
  technicianPhoto?: string;
  service: string;
  scheduledDate: string | Date;
  scheduledTime: string;
  price?: number;
  totalPrice?: number;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  address: string;
  notes?: string;
  hasRating?: boolean;
  onStatusChange?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  technicianId,
  technicianName = "Unknown Technician",
  technicianPhoto,
  service,
  scheduledDate,
  scheduledTime,
  price,
  totalPrice,
  status,
  address,
  hasRating = false,
  onStatusChange,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string | Date) => {
    if (!date) return "Tanggal tidak tersedia";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Tanggal tidak valid";
      }
      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "confirmed":
        return "Dikonfirmasi";
      case "in-progress":
        return "Sedang Berjalan";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return "Unknown";
    }
  };

  const isOngoing = ["pending", "confirmed", "in-progress"].includes(status);
  const isCompleted = status === "completed";

  const handleCompleteOrder = async () => {
    Alert.alert(
      "Selesaikan Pesanan",
      "Apakah Anda yakin pesanan ini sudah selesai?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Ya, Selesai",
          onPress: async () => {
            try {
              setLoading(true);
              const result = await updateBookingStatus(id, "completed");

              if (result.success) {
                Alert.alert("Berhasil", "Pesanan telah diselesaikan", [
                  {
                    text: "OK",
                    onPress: () => {
                      if (onStatusChange) {
                        onStatusChange();
                      }
                    },
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  result.error || "Gagal menyelesaikan pesanan"
                );
              }
            } catch (error) {
              console.error("Error completing order:", error);
              Alert.alert(
                "Error",
                "Terjadi kesalahan saat menyelesaikan pesanan"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderButtons = () => {
    if (isOngoing) {
      return (
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity className="border border-grayText px-3 py-2 rounded-lg items-center">
            <Text className="text-grayText">Hubungi Teknisi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary px-3 py-2 rounded-lg items-center"
            onPress={handleCompleteOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-poppins-medium">Selesai</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    if (isCompleted) {
      return (
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            className={`border ${hasRating ? 'border-primary' : 'border-grayText'} px-3 py-2 rounded-lg`}
            onPress={() =>
              router.push({
                pathname: "/technician/[id]",
                params: { id: technicianId },
              })
            }
          >
            <Text className={hasRating ? 'text-primary' : 'text-grayText'}>Pesan Lagi</Text>
          </TouchableOpacity>
          {!hasRating && (
            <TouchableOpacity
              className="border border-primary px-3 py-2 rounded-lg"
              onPress={() =>
                router.push({
                  pathname: "/orders/[id]",
                  params: { id: id },
                })
              }
            >
              <Text className="text-primary">Nilai</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (status === "cancelled") {
      return (
        <View className="flex-row justify-end gap-3">
          <TouchableOpacity
            className="border border-primary px-3 py-2 rounded-lg"
            onPress={() =>
              router.push({
                pathname: "/technician/[id]",
                params: { id: technicianId },
              })
            }
          >
            <Text className="text-primary">Pesan Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
      <Text className="text-primary text-[11px] font-poppins-medium text-right">
        {getStatusText()}
      </Text>

      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={
            technicianPhoto
              ? { uri: technicianPhoto }
              : require("@/assets/images/avatar.jpg")
          }
          className="w-20 h-20 rounded-full mr-3 border-2 border-primary"
        />
        <View className="flex-1">
          <Text className="font-poppins-medium text-grayText">
            {technicianName}
          </Text>
          <Text className="text-black font-poppins-medium">{service}</Text>
          <Text className="text-[11px] text-grayText mt-1 font-poppins-medium">
            {formatDate(scheduledDate)}
          </Text>
          <Text className="text-[11px] text-grayText font-poppins-medium">
            {scheduledTime}
          </Text>
        </View>
      </View>

      {/* Total Layanan */}
      <Text className="text-right text-[11px] text-gray-600 mb-3 font-poppins-medium">
        Total Layanan:
        <Text className="font-poppins-semibold">
          {" "}
          {formatRupiah(price || totalPrice || 0)}
        </Text>
      </Text>

      {/* Buttons */}
      {renderButtons()}
    </View>
  );
};

export default OrderCard;
