import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function ProfileMenuItem({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mx-6 py-6 border-b border-gray-200"
    >
      <Text className="text-base font-poppins-medium text-grayText">{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#4B5563" />
    </TouchableOpacity>
  );
}
