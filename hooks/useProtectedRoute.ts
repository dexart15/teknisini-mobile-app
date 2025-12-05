import { useAuthStore } from "@/store/authStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { user, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      // User tidak login tapi coba akses halaman protected
      router.replace("/login");
    } else if (
      user &&
      !inAuthGroup &&
      segments[0] !== "order" &&
      segments[0] !== "orders" &&
      segments[0] !== "technician"
    ) {
      // User sudah login tapi masih di halaman login/signup
      if (segments[0] === "login" || segments[0] === "signup") {
        router.replace("/(tabs)/home");
      }
    }
  }, [user, segments, initialized]);
}
