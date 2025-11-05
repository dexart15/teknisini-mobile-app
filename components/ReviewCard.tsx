import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  name: string;
  time: string;
  rating: number;
  review: string;
  onPress?: () => void;
};

export default function ReviewCard({ name, time, rating, review, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 shadow-sm mx-1 mt-2"
    >
      <View className="flex-row items-center mb-2">
        <Image
          source={require("@/assets/images/reviewer1.jpg")}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-2 flex-1">
          <Text className="font-[Poppins-SemiBold] text-sm">{name}</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="ml-1 text-gray-600 text-xs">{rating.toFixed(1)}</Text>
            </View>
            <Text className="text-grayText text-xs ml-2">{time}</Text>
          </View>
        </View>
      </View>
      <Text className="text-gray-700 text-sm font-poppins">{review}</Text>
    </TouchableOpacity>
  );
}
