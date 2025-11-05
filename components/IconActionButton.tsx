import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function IconActionButton({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center mx-3"
    >
      <View className="w-16 h-16 bg-white rounded-full items-center justify-center">
        <Ionicons name={icon} size={28} color="#32A4FF" />
      </View>
      <Text className="text-gray-700 text-base mt-1 font-poppins">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
