import { formatRupiah } from "@/utils/formatRupiah";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface OrderCardProps {
  id: number;
  technician: {
    id: number;
    name: string;
    category: string;
    image: any;
  };
  service: string;
  date: string;
  time: string;
  price: number;
  status: "ongoing" | "completed" | "reviewed";
}

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  technician,
  service,
  date,
  time,
  price,
  status,
}) => {
  const router = useRouter();

  const renderButtons = () => {
    if (status === "ongoing") {
      return (
        <View className="flex-row justify-end">
          <TouchableOpacity className="border border-grayText px-3 py-2 rounded-lg items-center">
            <Text className="text-grayText">Hubungi Teknisi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === "completed") {
      return (
        <View className="flex-row justify-end gap-3"> 
          <TouchableOpacity
            className="border border-grayText px-3 py-2 rounded-lg"
            onPress={() => router.push({
              pathname: "/technician/[id]",
              params: { id: String(id) },
            })}
          >
            <Text className="text-grayText">Pesan Lagi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-primary px-3 py-2 rounded-lg"
            onPress={() => router.push({
                pathname: "/orders/[id]",
                params: { id: String(id) },
              })}
          >
            <Text className="text-primary">Nilai</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === "reviewed") {
      return (
        <View className="flex-row justify-end gap-3"> 
          <TouchableOpacity className="border border-primary px-3 py-2 rounded-lg">
            <Text className="text-primary">Pesan Lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-4 shadow">
      <Text className="text-primary text-[11px] font-poppins-medium text-right">
        {status === "ongoing"
          ? "Sedang Berjalan"
          : status === "completed"
          ? "Selesai"
          : "Sudah Dinilai"}
      </Text>

      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image source={technician.image} className="w-20 h-20 rounded-full mr-3 border-2 border-primary" />
        <View className="flex-1">
          <Text className="font-poppins-medium text-grayText">{technician.name}</Text>
          <Text className="text-black font-poppins-medium">{service}</Text>
          <Text className="text-[11px] text-grayText mt-1 font-poppins-medium">{date}</Text>
          <Text className="text-[11px] text-grayText font-poppins-medium">{time}</Text>
        </View>
      </View>

      {/* Total Layanan */}
      <Text className="text-right text-[11px] text-gray-600 mb-3 font-poppins-medium">
        Total Layanan:  
        <Text className="font-poppins-semibold">
          {" "}{formatRupiah(price)}
        </Text>
      </Text>

      {/* Buttons */}
      {renderButtons()}
    </View>
  );
};

export default OrderCard;
