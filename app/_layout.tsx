import Colors from "@/constants/Colors";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth observer
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  // Protect routes that require authentication
  useProtectedRoute();

  if (!fontsLoaded || !initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
