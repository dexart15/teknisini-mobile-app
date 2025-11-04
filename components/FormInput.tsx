// components/FormInput.tsx
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface FormInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

export default function FormInput({ placeholder, secureTextEntry }: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-row items-center bg-white rounded-full px-4 py-4 my-2 border-2 border-gray-200">
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor={Colors.textLight}
        className="flex-1 text-[15px] font-poppins"
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={Colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
