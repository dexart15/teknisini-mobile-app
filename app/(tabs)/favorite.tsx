import CategoryItem from "@/components/CategoryItem";
import ProfileHeader from "@/components/ProfileHeader";
import TechnicianCard from "@/components/TechnicianCard";
import {
  getUserFavorites,
  toggleFavorite as toggleFavoriteService,
} from "@/services/favoriteService";
import { getTechnicianById, Technician } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const categories = [
  { id: 1, name: "Kelistrikan", iconName: "flash" as const },
  { id: 2, name: "Elektronik", iconName: "tv" as const },
  { id: 3, name: "Jaringan", iconName: "wifi" as const },
  { id: 4, name: "Komputer", iconName: "desktop" as const },
  { id: 5, name: "Otomotif", iconName: "car-sport" as const },
];

export default function FavoriteScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favoriteTechnicians, setFavoriteTechnicians] = useState<Technician[]>(
    []
  );
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(
    []
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterByCategory();
  }, [selectedCategory, favoriteTechnicians]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getUserFavorites(user.uid);

    if (result.success && result.data) {
      const techPromises = result.data.map((fav) =>
        getTechnicianById(fav.technicianId)
      );
      const techResults = await Promise.all(techPromises);

      const technicians = techResults
        .filter((r) => r.success && r.data)
        .map((r) => r.data as Technician);

      setFavoriteTechnicians(technicians);
      setFilteredTechnicians(technicians);
      setFavoriteIds(result.data.map((f) => f.technicianId));
    }
    setLoading(false);
  };

  const filterByCategory = () => {
    if (!selectedCategory) {
      setFilteredTechnicians(favoriteTechnicians);
    } else {
      const filtered = favoriteTechnicians.filter(
        (tech) => tech.category === selectedCategory
      );
      setFilteredTechnicians(filtered);
    }
  };

  const handleToggleFavorite = async (technicianId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const result = await toggleFavoriteService(user.uid, technicianId);
    if (result.success) {
      // Remove from local state
      setFavoriteTechnicians((prev) =>
        prev.filter((t) => t.id !== technicianId)
      );
      setFavoriteIds((prev) => prev.filter((id) => id !== technicianId));
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(
        selectedCategory === category.name ? null : category.name
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <ScrollView className="flex-1 bg-secondary px-5 pt-16">
        <ProfileHeader />
        <View className="items-center justify-center mt-20">
          <Text className="text-gray-600 font-poppins text-center">
            Silakan login untuk melihat favorit Anda
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-secondary px-5 pt-16"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <ProfileHeader />

      {/* Categories */}
      <Text className="text-2xl font-poppins-medium mb-3">Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            id={category.id}
            name={category.name}
            iconName={category.iconName}
            selected={selectedCategory === category.name}
            onSelect={handleCategorySelect}
          />
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-between mt-6 mb-3">
        <Text className="text-2xl font-poppins-medium">Teknisi Favorit</Text>
        {filteredTechnicians.length > 0 && (
          <Text className="text-sm font-poppins text-gray-500">
            {filteredTechnicians.length} teknisi
          </Text>
        )}
      </View>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="#32A4FF" />
          <Text className="text-gray-500 font-poppins mt-2">
            Memuat favorit...
          </Text>
        </View>
      ) : filteredTechnicians.length === 0 ? (
        <View className="items-center justify-center mt-20">
          <Text className="text-softGrayText text-base text-center">
            {favoriteTechnicians.length === 0
              ? "Kamu belum menambahkan teknisi favorit."
              : "Tidak ada teknisi favorit di kategori ini."}
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between pb-5">
          {filteredTechnicians.map((tech) => (
            <TechnicianCard
              key={tech.id}
              id={tech.id}
              name={tech.name}
              category={tech.category}
              location={tech.location}
              image={
                tech.photoURL
                  ? { uri: tech.photoURL }
                  : require("@/assets/images/avatar.jpg")
              }
              rating={tech.rating}
              price={tech.price}
              isFavorite={favoriteIds.includes(tech.id)}
              onToggleFavorite={() => handleToggleFavorite(tech.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
