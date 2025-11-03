import CategoryItem from "@/components/CategoryItem";
import TechnicianCard from "@/components/TechnicianCard";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

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
      {/* Categories */}
      <Text className="text-2xl font-poppins-medium mb-3">Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            id={cat.id}
            name={cat.name}
            icon={cat.icon}
            selected={selectedCategory === cat.id}
            onSelect={setSelectedCategory}
          />
        ))}
      </ScrollView>

      {/* Best Technicians */}
      <Text className="text-2xl font-poppins-medium mt-6 mb-3">
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
