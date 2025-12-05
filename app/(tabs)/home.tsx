import BannerCarousel from "@/components/BannerCarousel";
import CategoryItem from "@/components/CategoryItem";
import ProfileHeader from "@/components/ProfileHeader";
import SearchInput from "@/components/SearchInput";
import TechnicianCard from "@/components/TechnicianCard";
import {
  getFavoriteTechnicianIds,
  toggleFavorite as toggleFavoriteService,
} from "@/services/favoriteService";
import { getAllTechnicians, Technician } from "@/services/technicianService";
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

// const technicians = [
//   {
//     id: 1,
//     name: "Mahendra Saputra",
//     category: "Kelistrikan",
//     location: "Denpasar, Bali",
//     image: require("@/assets/images/tech1.jpg"),
//   },
//   {
//     id: 2,
//     name: "Wahyu Dwi Putra",
//     category: "Komputer",
//     location: "Gianyar, Bali",
//     image: require("@/assets/images/tech2.jpg"),
//   },
//   {
//     id: 3,
//     name: "Gede Mahesa",
//     category: "Elektronik",
//     location: "Badung, Bali",
//     image: require("@/assets/images/tech3.jpg"),
//   },
//   {
//     id: 4,
//     name: "Githa Amyguna",
//     category: "Jaringan",
//     location: "Denpasar, Bali",
//     image: require("@/assets/images/tech4.jpg"),
//   },
// ];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(
    []
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTechnicians();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterTechnicians();
  }, [selectedCategory, technicians, searchQuery]);

  const loadTechnicians = async () => {
    setLoading(true);
    const result = await getAllTechnicians();
    if (result.success && result.data) {
      setTechnicians(result.data);
      setFilteredTechnicians(result.data);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    if (!user) return;
    const result = await getFavoriteTechnicianIds(user.uid);
    if (result.success && result.data) {
      setFavorites(result.data);
    }
  };

  const filterTechnicians = () => {
    let filtered = [...technicians];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((tech) => tech.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tech) =>
          tech.name.toLowerCase().includes(query) ||
          tech.category.toLowerCase().includes(query) ||
          tech.location.toLowerCase().includes(query) ||
          tech.description.toLowerCase().includes(query)
      );
    }

    setFilteredTechnicians(filtered);
  };

  const handleToggleFavorite = async (technicianId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const result = await toggleFavoriteService(user.uid, technicianId);
    if (result.success) {
      // Update local state
      setFavorites((prev) =>
        prev.includes(technicianId)
          ? prev.filter((id) => id !== technicianId)
          : [...prev, technicianId]
      );
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
    await loadTechnicians();
    if (user) {
      await loadFavorites();
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-secondary px-5 pt-16"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <ProfileHeader />

      {/* Search */}
      <SearchInput
        placeholder="Cari teknisi, kategori, lokasi..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Banner Carousel */}
      <BannerCarousel />

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

      {/* Best Technicians */}
      <View className="flex-row items-center justify-between mt-6 mb-3">
        <Text className="text-2xl font-poppins-medium">
          {selectedCategory ? `${selectedCategory}` : "Teknisi Terbaik"}
        </Text>
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
            Memuat data...
          </Text>
        </View>
      ) : filteredTechnicians.length === 0 ? (
        <View className="py-10 items-center">
          <Text className="text-gray-500 font-poppins text-center">
            {searchQuery
              ? "Tidak ada teknisi yang sesuai dengan pencarian"
              : "Belum ada teknisi tersedia"}
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
              isFavorite={favorites.includes(tech.id)}
              onToggleFavorite={() => handleToggleFavorite(tech.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
