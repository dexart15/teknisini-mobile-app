import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryItemProps {
  id: number;
  name: string;
  icon: any;
  selected: boolean;
  onSelect: (id: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  id,
  name,
  icon,
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
        className={`w-20 h-20 rounded-full justify-center items-center transition-colors duration-200 ${
          selected
            ? "bg-white border-2 border-primary"
            : "bg-white border border-gray-300"
        }`}
      >
        <Image
          source={icon}
          className={`w-16 h-16 ${
            selected ? "tint-primary" : "tint-gray-400"
          }`}
          resizeMode="contain"
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
