import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CategoryItemProps {
  id: number;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap; // nama icon dari Ionicons
  selected: boolean;
  onSelect: (id: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  id,
  name,
  iconName,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      className="items-center mr-4"
      activeOpacity={0.7}
    >
      {/* Icon wrapper */}
      <View
        className={`w-20 h-20 rounded-full justify-center items-center ${
          selected
            ? "bg-white border-2 border-primary"
            : "bg-white border border-gray-200"
        }`}
      >
        <Ionicons
          name={iconName}
          size={30}
          color={selected ? '#32A4FF' : '#A6A6A6'}
        />
      </View>

      {/* Label */}
      <Text
        className={`text-center text-sm mt-2 ${
          selected
            ? "text-primary font-poppins-medium"
            : "text-gray-600 font-poppins"
        }`}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;