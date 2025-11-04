import CategoryItem from "@/components/CategoryItem";
import ProfileHeader from "@/components/ProfileHeader";
import TechnicianCard from "@/components/TechnicianCard";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

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

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-16">
      {/* Header */}
      <ProfileHeader />

      {/* Banner */}
      <Image
        source={require("@/assets/images/banner.png")}
        className="w-full h-40 rounded-xl mb-5"
        resizeMode="cover"
      />

      {/* Categories */}
      <Text className="text-2xl font-poppins-medium mb-3">Kategori</Text>
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

      {/* Best Technicians */}
      <Text className="text-2xl font-poppins-medium mt-6 mb-3">
        Teknisi Terbaik
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
