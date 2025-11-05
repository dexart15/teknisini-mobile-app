import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap; // tipe untuk icon name
  onPress: () => void;
}

export default function OrderMenuItem({ title, icon, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
    >
      <Ionicons name={icon} size={20} color="#32A4FF" />
      <Text className="flex-1 ml-3 text-base font-poppins-medium text-grayText">
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#4B5563" />
    </TouchableOpacity>
  );
}