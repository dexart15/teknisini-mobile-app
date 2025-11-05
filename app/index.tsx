import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login"); // Pindah ke login setelah 2 detik
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
