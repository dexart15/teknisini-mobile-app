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
          <Text className="font-poppins-medium text-base capitalize text-grayText">{name}</Text>
          <View className="flex-row items-center justify-between pt-1">
            <View className="flex-row items-center">
              {/* Render 5 stars based on rating */}
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={14}
                  color={star <= rating ? "#FFD700" : "#D1D5DB"}
                  className="pe-0.5"
                />
              ))}
              <Text className="text-grayText text-xs ml-2">{time}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className="text-gray-600 font-poppins text-sm">{review}</Text>
    </TouchableOpacity>
  );
}
