import CategoryItem from "@/components/CategoryItem";
import SearchInputWithClear from "@/components/SearchInputWithClear";
import TechnicianCard from "@/components/TechnicianCard";
import {
  getUserFavorites,
  toggleFavorite as toggleFavoriteService,
} from "@/services/favoriteService";
import { filterTechnicians, Technician } from "@/services/technicianService";
import { useAuthStore } from "@/store/authStore";
import * as ExpoLocation from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [nearbyTechnicians, setNearbyTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getUserLocation();
    loadFavorites();
  }, [user]);

  // Reload nearby technicians when category changes
  useEffect(() => {
    if (userCity) {
      loadNearbyTechnicians(userCity);
    }
  }, [selectedCategory]);

  // Normalize city name (remove "Kota", "Kabupaten", etc)
  const normalizeCityName = (cityName: string): string => {
    return cityName
      .toLowerCase()
      .replace(/^(kota|kabupaten|kab\.?)\s+/i, "")
      .trim();
  };

  // Check if technician location matches user city
  const isLocationMatch = (techLocation: string, userCityName: string): boolean => {
    const normalizedUserCity = normalizeCityName(userCityName);
    const normalizedTechLocation = techLocation.toLowerCase();
    
    // Check if normalized city name is in the location
    return normalizedTechLocation.includes(normalizedUserCity);
  };

  // Get user's location and city/kabupaten
  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      console.log("Requesting location permission...");
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status);
      
      if (status !== "granted") {
        Alert.alert(
          "Izin Lokasi Diperlukan",
          "Aktifkan izin lokasi untuk menemukan teknisi terdekat"
        );
        setLocationLoading(false);
        return;
      }

      console.log("Getting current position...");
      const location = await ExpoLocation.getCurrentPositionAsync({});
      console.log("Current position:", location.coords);
      
      const [address] = await ExpoLocation.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Reverse geocode address:", address);

      if (address) {
        // Get city or subregion (kabupaten)
        const city = address.city || address.subregion || address.region || null;
        console.log("Detected city:", city);
        setUserCity(city);
        
        if (city) {
          loadNearbyTechnicians(city);
        } else {
          // If no city detected, load all technicians
          console.log("No city detected, loading all technicians");
          loadNearbyTechnicians("");
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
      // Load all technicians as fallback
      loadNearbyTechnicians("");
    } finally {
      setLocationLoading(false);
    }
  };

  const loadNearbyTechnicians = async (city: string) => {
    try {
      console.log("Loading nearby technicians for city:", city);
      const result = await filterTechnicians({});
      console.log("filterTechnicians result:", result);
      
      if (result.success && result.data) {
        console.log("All technicians count:", result.data.length);
        
        if (city) {
          // Filter technicians by user's city/kabupaten using normalized matching
          let nearby = result.data.filter((tech) =>
            isLocationMatch(tech.location, city)
          );
          
          // Apply category filter if selected
          if (selectedCategory) {
            nearby = nearby.filter((tech) => tech.category === selectedCategory);
          }
          
          console.log("Nearby technicians count:", nearby.length);
          console.log("Nearby technicians:", nearby);
          setNearbyTechnicians(nearby);
        } else {
          // No city detected, don't show any nearby technicians
          setNearbyTechnicians([]);
        }
      } else {
        console.log("filterTechnicians failed:", result.error);
        setNearbyTechnicians([]);
      }
    } catch (error) {
      console.error("Error loading nearby technicians:", error);
      setNearbyTechnicians([]);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const result = await getUserFavorites(user.uid);
      if (result.success && result.data) {
        setFavoriteIds(result.data.map((f) => f.technicianId));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      let results: Technician[] = [];

      // Get all technicians first (without available filter to avoid index issues)
      const allResult = await filterTechnicians({});
      console.log("Search - filterTechnicians result:", allResult);
      
      if (allResult.success && allResult.data) {
        results = allResult.data;
        
        // Filter by search query (name or city)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          results = results.filter((tech) =>
            tech.name.toLowerCase().includes(query) ||
            tech.location.toLowerCase().includes(query)
          );
        }
        
        // Filter by category
        if (selectedCategory) {
          results = results.filter((tech) => tech.category === selectedCategory);
        }
        
        // Exclude nearby technicians from search results to avoid duplicates
        if (userCity) {
          results = results.filter(
            (tech) => !isLocationMatch(tech.location, userCity)
          );
        }
        
        console.log("Search results count:", results.length);
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
    
    // Toggle: jika kategori yang sama diklik lagi, matikan filter
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-16">
      {/* Search Input */}
      <View className="mb-2">
        <SearchInputWithClear
          placeholder="Cari berdasarkan nama atau kota"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
      
      {/* Nearby Technicians berdasarkan gps user*/}
      {!locationLoading && nearbyTechnicians.length > 0 && (
        <>
          <Text className="text-2xl font-poppins-medium mt-8 mb-1">
            Teknisi Terdekat
          </Text>
          {userCity && (
            <Text className="text-sm text-gray-500 font-poppins mb-3">
              Lokasi Anda: {userCity}
            </Text>
          )}
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
        </>
      )}

      {/* Search Results */}
      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="#32A4FF" />
          <Text className="text-gray-500 font-poppins mt-2">
            Mencari teknisi...
          </Text>
        </View>
      ) : hasSearched ? (
        <>
          <View className="flex-row items-center justify-between mt-8 mb-3">
            <Text className="text-2xl font-poppins-medium">
              Teknisi Tersedia
            </Text>
            <Text className="text-sm font-poppins text-gray-500">
              {technicians.length} teknisi
            </Text>
          </View>
          {technicians.length > 0 ? (
            <View className="flex-row flex-wrap justify-between pb-10">
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
          ) : (
            <View className="py-6 items-center">
              <Text className="text-gray-500 font-poppins">
                Tidak ada teknisi yang ditemukan
              </Text>
            </View>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}
