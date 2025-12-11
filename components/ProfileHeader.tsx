import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Ambil nama dari email (bagian sebelum @) atau displayName jika ada
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  // Fungsi untuk mendapatkan inisial dari displayName
  const getInitials = (name: string): string => {
    const cleanName = name.trim();
    if (cleanName.length === 0) return "U";
    
    // Ambil huruf pertama dan terakhir
    const firstChar = cleanName[0].toUpperCase();
    const lastChar = cleanName[cleanName.length - 1].toUpperCase();
    
    return firstChar + lastChar;
  };

  const initials = getInitials(displayName);

  return (
    <TouchableOpacity
      // activeOpacity={0.8}
      onPress={() => router.push(`/profile` as any)}
    >
      <View className="flex-row items-center mb-5">
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className="w-12 h-12 mr-3 border-2 rounded-full border-primary"
          />
        ) : (
          <View className="w-12 h-12 mr-3 border-2 rounded-full border-primary bg-primary items-center justify-center">
            <Text className="text-white text-base font-poppins-semibold">
              {initials}
            </Text>
          </View>
        )}
        <View>
          <Text className="text-black font-poppins-medium capitalize">
            Hai {displayName}
          </Text>
          <Text className="font-poppins-medium text-grayText">
            Selamat Datang Kembali
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
