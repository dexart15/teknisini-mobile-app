import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const categories = [
  { id: 1, name: "Kelistrikan", icon: require("@/assets/icons/electric.png") },
  { id: 2, name: "Elektronik", icon: require("@/assets/icons/electronic.png") },
  { id: 3, name: "Jaringan", icon: require("@/assets/icons/network.png") },
  { id: 4, name: "Komputer", icon: require("@/assets/icons/computer.png") },
  { id: 5, name: "Otomotif", icon: require("@/assets/icons/automotive.png") },
];

const technicians = [
  {
    id: 1,
    name: "Mahendra Saputra",
    category: "Kelistrikan",
    location: "Denpasar, Bali",
    image: require("@/assets/images/tech1.png"),
  },
  {
    id: 2,
    name: "Wahyu Putra",
    category: "Komputer",
    location: "Gianyar, Bali",
    image: require("@/assets/images/tech2.png"),
  },
  {
    id: 3,
    name: "Gede Mahesa",
    category: "Elektronik",
    location: "Badung, Bali",
    image: require("@/assets/images/tech3.png"),
  },
  {
    id: 4,
    name: "Githa Amyguna",
    category: "Jaringan",
    location: "Denpasar, Bali",
    image: require("@/assets/images/tech4.png"),
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-10">
      {/* Header */}
      <View className="flex-row items-center mb-5">
        <Image
          source={require("@/assets/images/avatar.png")}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="font-poppins-medium text-gray-700">Hai Dharma</Text>
          <Text className="font-poppins text-gray-500">
            Selamat Datang Kembali
          </Text>
        </View>
      </View>

      {/* Banner */}
      <Image
        source={require("@/assets/images/banner.png")}
        className="w-full h-32 rounded-xl mb-5"
        resizeMode="cover"
      />

      {/* Category */}
      <Text className="text-lg font-poppins-bold mb-3">Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`items-center mr-4 ${
              selectedCategory === item.id ? "opacity-100" : "opacity-50"
            }`}
            onPress={() => setSelectedCategory(item.id)}
          >
            <View
              className={`w-16 h-16 rounded-full justify-center items-center ${
                selectedCategory === item.id
                  ? "bg-primary"
                  : "bg-white border border-gray-200"
              }`}
            >
              <Image source={item.icon} className="w-8 h-8" resizeMode="contain" />
            </View>
            <Text className="text-center text-sm font-poppins mt-1">
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Best Technicians */}
      <Text className="text-lg font-poppins-bold mt-6 mb-3">
        Teknisi Terbaik
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {technicians.map((tech) => (
          <View
            key={tech.id}
            className="w-[48%] bg-white p-3 rounded-2xl mb-4 shadow-sm"
          >
            <Image
              source={tech.image}
              className="w-full h-28 rounded-xl mb-2"
              resizeMode="cover"
            />
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-poppins-medium text-[13px] w-[80%]">
                {tech.name}
              </Text>
              <TouchableOpacity onPress={() => toggleFavorite(tech.id)}>
                <Ionicons
                  name={
                    favorites.includes(tech.id) ? "heart" : "heart-outline"
                  }
                  size={20}
                  color={favorites.includes(tech.id) ? Colors.primary : "gray"}
                />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-[12px]">{tech.category}</Text>
            <Text className="text-gray-400 text-[11px]">{tech.location}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
