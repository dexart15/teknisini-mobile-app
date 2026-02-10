// components/SearchInputWithClear.tsx

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputWithClearProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchInputWithClear({
  placeholder,
  value,
  onChangeText,
}: SearchInputWithClearProps) {
  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View className="flex-row items-center bg-white rounded-full px-4 py-4 my-2 border-2 border-gray-200">
      {/* Search Icon */}
      <Ionicons
        name="search-outline"
        size={20}
        color={Colors.textLight}
        style={{ marginRight: 8 }}
      />
      
      {/* Text Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        className="flex-1 text-[15px] font-poppins"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      
      {/* Clear Button (only show when there's text) */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
