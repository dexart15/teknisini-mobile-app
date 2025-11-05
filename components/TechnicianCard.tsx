import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

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
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-[48%] bg-white p-3 rounded-2xl mb-4 shadow-sm items-center"
      onPress={() =>
        router.push(`/technician/${id}?name=${name}&category=${category}&location=${location}&image=${image}`)
      }
    >
      <TouchableOpacity
        className="absolute right-3 top-3 z-10"
        onPress={() => onToggleFavorite(id)}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? Colors.primary : "gray"}
        />
      </TouchableOpacity>

      <Image
        source={image}
        className="w-20 h-20 rounded-full mb-2 border-primary border-2"
        resizeMode="cover"
      />

      <Text
        numberOfLines={1}
        className="font-poppins-medium text-[13px] w-[80%] text-center"
      >
        {name}
      </Text>
      <Text className="text-grayText text-[12px] text-center">{category}</Text>
      <Text className="text-softGrayText text-[11px] text-center">
        {location}
      </Text>
    </TouchableOpacity>
  );
};

export default TechnicianCard;
