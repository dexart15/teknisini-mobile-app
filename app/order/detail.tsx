import DateTimeInputModal from "@/components/DateTimeInput";
import OrderMenuItem from "@/components/OrderMenuItem";
import Colors from "@/constants/Colors";
import { technicians } from "@/data/technicians";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const technician = technicians.find((t) => t.id === Number(id));

  if (!technician) return null;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const serviceList = [
    { id: 1, name: "Perbaikan lampu ruang tidur", price: 125000 },
    { id: 2, name: "Instalasi stop kontak", price: 95000 },
    { id: 3, name: "Pemasangan kipas angin", price: 110000 },
    { id: 4, name: "Servis komputer lemot", price: 150000 },
  ];

  const transportCost = 20000;
  const total = (servicePrice || 0) + transportCost;

  const handleSelectService = (service: any) => {
    setSelectedService(service.name);
    setServicePrice(service.price);
    setShowServiceModal(false);
  };

  return (
    <View className="flex-1 bg-secondary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white py-12 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="px-4 mt-4">
            <Ionicons name="arrow-back" size={24} color="#32A4FF" />
          </TouchableOpacity>
          <Text className="ml-[4.5rem] mt-4 text-2xl font-poppins-bold text-black">
            Detail Pemesanan
          </Text>
        </View>

        {/* Alamat */}
        <View className="bg-white mt-2 px-5 py-4 rounded-xl mx-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="ml-2">
                <Text className="font-poppins-semibold text-gray-900">
              <Ionicons name="location" size={20} color={Colors.primary} />
                  Alamat Tujuan
                </Text>
                <Text className="text-gray-600 text-sm w-[90%]">
                  Jl. Pulau Singkep No. 11, Denpasar Selatan, Bali
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </View>

        {/* Teknisi, Jadwal Kedatangan, Layanan */}
        <View className="bg-white mt-3 px-5 py-4 rounded-xl mx-4 shadow-sm">
          <Text className="text-2xl font-poppins-medium text-black mb-3">Teknisi</Text>
          <View className="flex-row items-center">
            <Image source={technician.image} className="w-14 h-14 rounded-full border-2 border-primary" />
            <View className="ml-3">
              <Text className="font-poppins-semibold text-gray-900 text-[15px]">
                {technician.name}
              </Text>
              <Text className="text-gray-600 text-[13px]">{technician.category}</Text>
            </View>
          </View>
          
          {/* Jadwal Kedatangan */}
          <Text className="text-2xl font-poppins-medium text-black mb-2 mt-6">Jadwal Kedatangan</Text>
          {/* Input Fields */}
          <View className="flex-row gap-3 mb-4">
            {/* Date Picker */}
            <View className="flex-1">
              <DateTimeInputModal
                placeholder="Pilih Tanggal"
                iconName="calendar-outline"
                mode="date"
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </View>

            {/* Time Picker */}
            <View className="flex-1">
              <DateTimeInputModal
                placeholder="Pilih Waktu"
                iconName="time-outline"
                mode="time"
                value={selectedTime}
                onChange={setSelectedTime}
              />
            </View>
          </View>
          <Text className="text-grayText text-sm">
            Jadwalkan kedatangan teknisi ke lokasi tujuan dan sesuaikan dengan ketersediaan teknisi.
          </Text>


          {/* Layanan */}
          <Text className="text-2xl font-poppins-medium text-black mb-2 mt-6">Layanan</Text>
          <TouchableOpacity
            onPress={() => setShowServiceModal(true)}
            className="flex-row items-center justify-between border border-primary rounded-full px-4 py-3"
          >
            <View className="flex-row items-center">
              <Ionicons name="construct-outline" size={18} color={Colors.primary} />
              <Text className="ml-2 text-gray-700 font-poppins">
                {selectedService || "Pilih layanan"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={Colors.primary} />
          </TouchableOpacity>

          {selectedService && (
            <View className="flex-row justify-between mt-3">
              <Text className="text-sm font-poppins-medium text-grayText">Total Layanan</Text>
              <Text className="text-primary font-poppins-semibold">
                Rp{servicePrice.toLocaleString("id-ID")}
              </Text>
            </View>
          )}
        </View>

        {/* Pilih Layanan */}
        {/* <View className="bg-white mt-3 px-5 py-4 rounded-xl mx-4 shadow-sm">
          
        </View> */}

        {/* Total */}
        <View className="bg-white mt-3 px-5 py-4 rounded-xl mx-4 shadow-sm mb-28">
          <View className="flex-row justify-between mb-2 py-2">
            <Text className="text-sm font-poppins-medium text-grayText">Biaya Transport</Text>
            <Text className="text-grayText font-poppins-medium">
              Rp{transportCost.toLocaleString("id-ID")}
            </Text>
          </View>
          <View className="flex-col">
            <OrderMenuItem
              title="Metode Pembayaran"
              icon="cash-outline"
              onPress={() => console.log('Pilih Metode Pembayaran')}
            />
            <OrderMenuItem
              title="Voucher TekniSini"
              icon="ticket-outline"
              onPress={() => console.log('Pilih Voucher')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="flex-row justify-between items-center px-6 pb-8 pt-4 bg-white border-t border-gray-200">
        <View>
            <Text className="text-sm font-poppins-medium text-grayText">
                Total Pembayaran
            </Text>
            <Text className="text-primary text-[20px] font-poppins-semibold">
                Rp{total.toLocaleString("id-ID")}
            </Text>
        </View>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-full">
          <Text className="text-white font-poppins-semibold text-base">
            Buat Pesanan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Pilih Layanan */}
      <Modal visible={showServiceModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl px-6 py-6">
            <Text className="text-lg font-poppins-semibold mb-4 text-gray-900">
              Pilih Layanan
            </Text>
            {serviceList.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => handleSelectService(service)}
                className="border border-gray-300 rounded-xl p-3 mb-2 flex-row justify-between items-center"
              >
                <Text className="text-gray-800">{service.name}</Text>
                <Text className="text-primary font-poppins-semibold">
                  Rp{service.price.toLocaleString("id-ID")}
                </Text>
              </Pressable>
            ))}
            <TouchableOpacity
              onPress={() => setShowServiceModal(false)}
              className="mt-4 py-3 rounded-full border border-primary items-center"
            >
              <Text className="text-primary font-poppins-semibold">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
