import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TechnicianCardProps {
  id: number;
  name: string;
  category: string;
  location: string;
  image: any;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  id,
  name,
  category,
  location,
  image,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <View className="w-[48%] bg-white p-3 rounded-2xl mb-4 shadow-sm items-center">
      <TouchableOpacity
        className="absolute right-3 top-3" 
        onPress={() => onToggleFavorite(id)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? Colors.primary : "gray"}
          />
        </TouchableOpacity>
      <Image
        source={image}
        className="w-20 h-20 rounded-full mb-2 border-primary border-2"
        resizeMode="cover"
      />
      <View className="flex-row justify-between items-center mb-1">
        <Text
          numberOfLines={1}
          className="font-poppins-medium text-[13px] w-[80%] text-center"
        >
          {name}
        </Text>
      </View>
      <Text className="text-grayText text-[12px] text-center">{category}</Text>
      <Text className="text-softGrayText text-[11px] text-center">{location}</Text>
    </View>
  );
};

export default TechnicianCard;
