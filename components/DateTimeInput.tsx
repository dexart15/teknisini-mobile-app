import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DateTimeInputProps {
  placeholder: string;
  iconName: keyof typeof Ionicons.glyphMap;
  mode: "date" | "time";
  value: Date;
  onChange: (date: Date) => void;
}

export default function DateTimeInputModal({
  placeholder,
  iconName,
  mode,
  value,
  onChange,
}: DateTimeInputProps) {
  const [show, setShow] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempValue(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempValue);
    setShow(false);
  };

  const formatDate = (date: Date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}.${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const displayValue = mode === "date" ? formatDate(value) : formatTime(value);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center bg-white rounded-full px-4 py-3 border border-primary"
        activeOpacity={0.7}
      >
        <Ionicons name={iconName} size={20} color={Colors.primary} />
        <Text className="flex-1 ml-3 text-base font-poppins-medium text-primary">
          {displayValue}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" ? (
        <Modal
          visible={show}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl pb-42">
              {/* Header */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text className="text-primary font-poppins-medium text-lg">Batal</Text>
                </TouchableOpacity>
                <Text className="font-poppins-semibold text-lg">
                  {mode === "date" ? "Pilih Tanggal" : "Pilih Waktu"}
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text className="text-primary font-poppins-medium text-lg">Selesai</Text>
                </TouchableOpacity>
              </View>

              {/* Picker */}
              <View className="items-center">
                <DateTimePicker
                  value={tempValue}
                  mode={mode}
                  display="spinner"
                  onChange={onDateTimeChange}
                  locale="id-ID"
                  textColor={Colors.text}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={value}
            mode={mode}
            display="default"
            onChange={onDateTimeChange}
            locale="id-ID"
          />
        )
      )}
    </View>
  );
}