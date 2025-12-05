import CategoryItem from "@/components/CategoryItem";
import FormInput from "@/components/FormInput";
import TechnicianCard from "@/components/TechnicianCard";
import {
  getUserFavorites,
  toggleFavorite as toggleFavoriteService,
} from "@/services/favoriteService";
import { filterTechnicians, Technician } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { id: 1, name: "Kelistrikan", iconName: "flash" as const },
  { id: 2, name: "Elektronik", iconName: "tv" as const },
  { id: 3, name: "Jaringan", iconName: "wifi" as const },
  { id: 4, name: "Komputer", iconName: "desktop" as const },
  { id: 5, name: "Otomotif", iconName: "car-sport" as const },
];

export default function SearchScreen() {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [nearbyTechnicians, setNearbyTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    loadNearbyTechnicians();
    loadFavorites();
  }, [user]);

  const loadNearbyTechnicians = async () => {
    try {
      const filters = { available: true };
      const allTechnicians = await filterTechnicians(filters);
      setNearbyTechnicians(allTechnicians.slice(0, 4)); // Show first 4 as nearby
    } catch (error) {
      console.error("Error loading nearby technicians:", error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const userFavorites = await getUserFavorites(user.uid);
      setFavoriteIds(userFavorites.map((f) => f.technicianId));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let results: Technician[] = [];

      if (location || selectedCategory) {
        const filters: any = {};
        if (selectedCategory) filters.category = selectedCategory;
        if (location) filters.location = location;
        filters.available = true;

        results = await filterTechnicians(filters);
      } else {
        // If no filters, show all available technicians
        results = await filterTechnicians({ available: true });
      }

      setTechnicians(results);
    } catch (error) {
      console.error("Error searching:", error);
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (technicianId: string) => {
    if (!user) {
      alert("Silakan login untuk menambahkan favorit");
      return;
    }

    try {
      await toggleFavoriteService(user.uid, technicianId);
      setFavoriteIds((prev) =>
        prev.includes(technicianId)
          ? prev.filter((id) => id !== technicianId)
          : [...prev, technicianId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    const categoryName =
      categories.find((c) => c.id === categoryId)?.name || null;
    setSelectedCategory(categoryName);
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-16">
      {/* Input Fields */}
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <FormInput
            placeholder="Masukan Kota"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput
            placeholder="Tanggal"
            value={date}
            onChangeText={setDate}
          />
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
            selected={selectedCategory === category.name}
            onSelect={handleCategorySelect}
          />
        ))}
      </ScrollView>

      {/* Search Button */}
      <TouchableOpacity
        className="bg-primary py-3 rounded-full mt-6"
        onPress={handleSearch}
        disabled={loading}
      >
        <Text className="text-center text-white font-poppins-semibold text-[16px]">
          {loading ? "Mencari..." : "Cari Teknisi"}
        </Text>
      </TouchableOpacity>

      {/* Search Results */}
      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="#32A4FF" />
          <Text className="text-gray-500 font-poppins mt-2">
            Mencari teknisi...
          </Text>
        </View>
      ) : technicians.length > 0 ? (
        <>
          <View className="flex-row items-center justify-between mt-8 mb-3">
            <Text className="text-2xl font-poppins-medium">
              Hasil Pencarian
            </Text>
            <Text className="text-sm font-poppins text-gray-500">
              {technicians.length} teknisi
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {technicians.map((tech) => (
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
        </>
      ) : null}

      {/* Nearby Technicians */}
      <Text className="text-2xl font-poppins-medium mt-8 mb-3">
        Teknisi Terdekat
      </Text>

      <View className="flex-row flex-wrap justify-between pb-5">
        {nearbyTechnicians.map((tech) => (
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
    </ScrollView>
  );
}
