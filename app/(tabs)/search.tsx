import CategoryItem from "@/components/CategoryItem";
import FormInput from "@/components/FormInput";
import TechnicianCard from "@/components/TechnicianCard";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const categories = [
  { id: 1, name: 'Kelistrikan', iconName: 'flash' as const },
  { id: 2, name: 'Elektronik', iconName: 'tv' as const },
  { id: 3, name: 'Jaringan', iconName: 'wifi' as const },
  { id: 4, name: 'Komputer', iconName: 'desktop' as const },
  { id: 5, name: 'Otomotif', iconName: 'car-sport' as const },
];

const technicians = [
  {
    id: 1,
    name: "Mahendra Saputra",
    category: "Kelistrikan",
    location: "Denpasar, Bali",
    image: require("@/assets/images/tech1.jpg"),
  },
  {
    id: 2,
    name: "Wahyu Dwi Putra",
    category: "Komputer",
    location: "Gianyar, Bali",
    image: require("@/assets/images/tech2.jpg"),
  },
  {
    id: 3,
    name: "Gede Mahesa",
    category: "Elektronik",
    location: "Badung, Bali",
    image: require("@/assets/images/tech3.jpg"),
  },
  {
    id: 4,
    name: "Githa Amyguna",
    category: "Jaringan",
    location: "Denpasar, Bali",
    image: require("@/assets/images/tech4.jpg"),
  },
];

export default function SearchScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-16">
      {/* Input Fields */}
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <FormInput placeholder="Masukan Kota" />
        </View>
        <View className="flex-1 ml-2">
          <FormInput placeholder="Tanggal" />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <CategoryItem
          key={category.id}
          id={category.id}
          name={category.name}
          iconName={category.iconName}
          selected={selectedCategory === category.id}
          onSelect={setSelectedCategory}
          />
        ))}
      </ScrollView>

      {/* Login Button */}
      <TouchableOpacity className="bg-primary py-3 rounded-full mt-6">
        <Text className="text-center text-white font-poppins-semibold text-[16px]"
        
        >
          Cari Teknisi
        </Text>
      </TouchableOpacity>

      {/* Best Technicians */}
      <Text className="text-2xl font-poppins-medium mt-8 mb-3">
        Teknisi Terdekat
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {technicians.map((tech) => (
          <TechnicianCard
            key={tech.id}
            {...tech}
            isFavorite={favorites.includes(tech.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </View>

      {/* Best Technicians */}
      <Text className="text-2xl font-poppins-medium mt-6 mb-3">
        Teknisi Tersedia
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {technicians.map((tech) => (
          <TechnicianCard
            key={tech.id}
            {...tech}
            isFavorite={favorites.includes(tech.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </View>
    </ScrollView>
  );
}
