import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    const timer = setTimeout(() => {
      // Redirect berdasarkan status login
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, initialized]);

  return (
    <View className="flex-1 items-center justify-center bg-secondary">
      {/* <Image 
        className="w-36 h-36 mb-4" source={require("@/assets/images/icon.png")} /> */}
      <Text className="text-3xl font-poppins-bold text-primary">
        TekniSini.
      </Text>
    </View>
  );
}
