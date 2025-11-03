import CategoryItem from "@/components/CategoryItem";
import ProfileHeader from "@/components/ProfileHeader";
import TechnicianCard from "@/components/TechnicianCard";
import { useFavoriteStore } from "@/store/favoriteStore";
import React, { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

const categories = [
    { id: 1, name: "Kelistrikan", icon: require("@/assets/icons/electric.png") },
    { id: 2, name: "Elektronik", icon: require("@/assets/icons/electronic.png") },
    { id: 3, name: "Jaringan", icon: require("@/assets/icons/network.png") },
    { id: 4, name: "Komputer", icon: require("@/assets/icons/computer.png") },
    { id: 5, name: "Otomotif", icon: require("@/assets/icons/automotive.png") },
  ];

export default function FavoriteScreen() {
     const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { favorites, toggleFavorite, isFavorite } = useFavoriteStore();


  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-16">
      {/* Header */}
      <ProfileHeader />

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

      <Text className="text-2xl font-poppins-medium mt-6 mb-2">
        Teknisi Favorit
      </Text>

      {favorites.length === 0 ? (
        <View className="items-center justify-center mt-20">
          <Text className="text-softGrayText text-base">
            Kamu belum menambahkan teknisi favorit.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TechnicianCard
              technician={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
        />
      )}
    </ScrollView>
  );
}
