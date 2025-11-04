import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { TextInput, View } from "react-native";

interface FormInputProps {
  placeholder: string;
  iconName?: keyof typeof Ionicons.glyphMap; // optional icon
  value?: string;
  onChangeText?: (text: string) => void;
  // tambahkan props lain yang diperlukan
}

const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  iconName,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View className="flex-row items-center bg-white rounded-full px-4 py-3 border border-gray-200">
      {/* Icon */}
      {iconName && (
        <Ionicons 
          name={iconName} 
          size={20} 
          color="#9CA3AF" 
          style={{ marginRight: 8 }}
        />
      )}
      
      {/* Input */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 font-poppins text-gray-700"
        {...props}
      />
    </View>
  );
};

export default FormInput;