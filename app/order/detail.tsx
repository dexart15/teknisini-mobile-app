import DateTimeInputModal from "@/components/DateTimeInput";
import OrderMenuItem from "@/components/OrderMenuItem";
import Colors from "@/constants/Colors";
import { createBooking } from "@/services/bookingService";
import { getTechnicianById, Technician } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import { formatRupiah } from "@/utils/formatRupiah";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadTechnician();
  }, [id]);

  const loadTechnician = async () => {
    try {
      const result = await getTechnicianById(id as string);
      if (result.success && result.data) {
        setTechnician(result.data);
      } else {
        Alert.alert("Error", "Teknisi tidak ditemukan");
        router.back();
      }
    } catch (error) {
      console.error("Error loading technician:", error);
      Alert.alert("Error", "Gagal memuat data teknisi");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Generate service list based on technician skills
  const getServiceList = () => {
    if (!technician || !technician.skills || technician.skills.length === 0) {
      return [];
    }

    // Convert skills array to service list
    return technician.skills.map((skill, index) => ({
      id: index + 1,
      name: skill,
    }));
  };

  const serviceList = getServiceList();

  const transportCost = 20000;
  const technicianPrice = technician?.price || 0;
  const total = technicianPrice + transportCost;

  const paymentMethods = [
    { id: 1, name: "BRI", accountNumber: "0012-01-123456-78-9", logo: "💳" },
    { id: 2, name: "BCA", accountNumber: "1234567890", logo: "💳" },
    { id: 3, name: "BNI", accountNumber: "9876543210", logo: "💳" },
    { id: 4, name: "Mandiri", accountNumber: "1350012345678", logo: "💳" },
  ];

  const handleSelectService = (service: { id: number; name: string }) => {
    setSelectedService(service.name);
    setShowServiceModal(false);
  };

  const handleSelectPayment = (payment: {
    id: number;
    name: string;
    accountNumber: string;
  }) => {
    setSelectedPayment(`${payment.name} - ${payment.accountNumber}`);
    setShowPaymentModal(false);
  };

  const handleCreateOrder = async () => {
    if (!user) {
      Alert.alert("Error", "Anda harus login terlebih dahulu");
      return;
    }

    if (!selectedService) {
      Alert.alert("Error", "Silakan pilih layanan terlebih dahulu");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Error", "Silakan masukkan alamat tujuan");
      return;
    }

    if (!technician) {
      Alert.alert("Error", "Data teknisi tidak ditemukan");
      return;
    }

    try {
      setCreating(true);

      // Format date
      const dateString = selectedDate.toISOString().split("T")[0];

      // Format time
      const timeString = selectedTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Create booking in Firestore
      const result = await createBooking({
        userId: user.uid,
        technicianId: id as string,
        technicianName: technician.name,
        technicianCategory: technician.category,
        technicianPhotoURL: technician.photoURL,
        service: selectedService,
        scheduledDate: dateString,
        scheduledTime: timeString,
        address: address.trim(),
        notes: notes.trim() || undefined,
        price: total,
        status: "pending",
      });

      if (result.success && result.id) {
        // Navigate to success screen
        router.replace({
          pathname: "/order/success",
          params: {
            bookingId: result.id,
            name: technician.name,
            category: technician.category,
            service: selectedService,
            total: total.toString(),
          },
        });
      } else {
        Alert.alert("Error", result.error || "Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-secondary">
        <ActivityIndicator size="large" color="#32A4FF" />
        <Text className="mt-2 text-gray-500 font-poppins">Memuat data...</Text>
      </View>
    );
  }

  if (!technician) {
    return (
      <View className="items-center justify-center flex-1 bg-secondary">
        <Text className="text-gray-500 font-poppins">
          Teknisi tidak ditemukan
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center pt-12 pb-8 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="px-4 mt-4">
            <Ionicons name="arrow-back" size={24} color="#32A4FF" />
          </TouchableOpacity>
          <Text className="ml-[4.5rem] mt-4 text-2xl font-poppins-bold text-black">
            Detail Pemesanan
          </Text>
        </View>

        {/* Alamat */}
        <View className="px-5 py-4 mx-4 mt-2 bg-white shadow-sm rounded-xl">
          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text className="text-gray-900 font-poppins-semibold">
              Alamat Tujuan
            </Text>
          </View>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={2}
            className="px-4 py-3 text-gray-700 rounded-lg bg-gray-50 font-poppins"
          />
        </View>

        {/* Teknisi, Jadwal Kedatangan, Layanan */}
        <View className="px-5 py-4 mx-4 mt-3 bg-white shadow-sm rounded-xl">
          <Text className="mb-3 text-2xl text-black font-poppins-medium">
            Teknisi
          </Text>
          <View className="flex-row items-center">
            <Image
              source={
                technician.photoURL
                  ? { uri: technician.photoURL }
                  : require("@/assets/images/avatar.jpg")
              }
              className="border-2 rounded-full w-14 h-14 border-primary"
            />
            <View className="ml-3">
              <Text className="font-poppins-semibold text-gray-900 text-[15px]">
                {technician.name}
              </Text>
              <Text className="text-gray-600 text-[13px]">
                {technician.category}
              </Text>
              <Text className="text-primary text-[12px] font-poppins-semibold">
                {formatRupiah(technician.price || 0)}/jam
              </Text>
            </View>
          </View>

          {/* Jadwal Kedatangan */}
          <Text className="mt-6 mb-2 text-2xl text-black font-poppins-medium">
            Jadwal Kedatangan
          </Text>
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
          <Text className="text-sm text-grayText">
            Jadwalkan kedatangan teknisi ke lokasi tujuan dan sesuaikan dengan
            ketersediaan teknisi.
          </Text>

          {/* Layanan */}
          <Text className="mt-6 mb-2 text-2xl text-black font-poppins-medium">
            Layanan
          </Text>
          <TouchableOpacity
            onPress={() => setShowServiceModal(true)}
            className="flex-row items-center justify-between px-4 py-3 border rounded-full border-primary"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="construct-outline"
                size={18}
                color={Colors.primary}
              />
              <Text className="ml-2 text-gray-700 font-poppins">
                {selectedService || "Pilih layanan"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={Colors.primary} />
          </TouchableOpacity>

          {/* Catatan */}
          <Text className="mt-6 mb-2 text-2xl text-black font-poppins-medium">
            Catatan (Opsional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambahkan catatan untuk teknisi..."
            multiline
            numberOfLines={3}
            className="px-4 py-3 text-gray-700 rounded-lg bg-gray-50 font-poppins"
            textAlignVertical="top"
          />
        </View>

        {/* Total */}
        <View className="px-5 py-4 mx-4 mt-3 bg-white shadow-sm rounded-xl mb-28">
          <View className="flex-col">
            <TouchableOpacity
              onPress={() => setShowPaymentModal(true)}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text className="ml-3 text-gray-900 font-poppins">
                  Metode Pembayaran
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-600 font-poppins">
                  {selectedPayment || "Pilih metode"}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
            <OrderMenuItem
              title="Voucher TekniSini"
              icon="ticket-outline"
              onPress={() => console.log("Pilih Voucher")}
            />
          </View>
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-sm font-poppins-medium text-grayText">
              Biaya Transport
            </Text>
            <Text className="text-grayText font-poppins-medium">
              Rp{transportCost.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-8 bg-white border-t border-gray-200">
        <View>
          <Text className="text-sm font-poppins-medium text-grayText">
            Total Pembayaran
          </Text>
          <Text className="text-primary text-[20px] font-poppins-semibold">
            Rp{total.toLocaleString("id-ID")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCreateOrder}
          disabled={creating || !selectedService}
          className={`px-6 py-3 rounded-full ${
            creating || !selectedService ? "bg-gray-400" : "bg-primary"
          }`}
        >
          {creating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base text-white font-poppins-semibold">
              Buat Pesanan
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal Pilih Layanan */}
      <Modal visible={showServiceModal} transparent animationType="slide">
        <View className="justify-end flex-1 bg-black/50">
          <View className="px-6 py-6 bg-white rounded-t-2xl">
            <Text className="mb-4 text-lg text-gray-900 font-poppins-semibold">
              Pilih Layanan
            </Text>
            {serviceList.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => handleSelectService(service)}
                className="p-3 mb-2 border border-gray-300 rounded-xl"
              >
                <Text className="text-gray-800">{service.name}</Text>
              </Pressable>
            ))}
            <TouchableOpacity
              onPress={() => setShowServiceModal(false)}
              className="items-center py-3 mt-4 border rounded-full border-primary"
            >
              <Text className="text-primary font-poppins-semibold">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Pilih Metode Pembayaran */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View className="justify-end flex-1 bg-black/50">
          <View className="px-6 py-6 bg-white rounded-t-2xl">
            <Text className="mb-4 text-lg text-gray-900 font-poppins-semibold">
              Pilih Metode Pembayaran
            </Text>
            {paymentMethods.map((payment) => (
              <Pressable
                key={payment.id}
                onPress={() => handleSelectPayment(payment)}
                className="p-4 mb-2 border border-gray-300 rounded-xl"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-2xl">{payment.logo}</Text>
                    <View>
                      <Text className="text-gray-900 font-poppins-semibold">
                        {payment.name}
                      </Text>
                      <Text className="text-sm text-gray-600 font-poppins">
                        {payment.accountNumber}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>
            ))}
            <TouchableOpacity
              onPress={() => setShowPaymentModal(false)}
              className="items-center py-3 mt-4 border rounded-full border-primary"
            >
              <Text className="text-primary font-poppins-semibold">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
