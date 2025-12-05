import { useAuthStore } from "@/store/authStore";
import { Image, Text, View } from "react-native";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  // Ambil nama dari email (bagian sebelum @) atau displayName jika ada
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  // Ambil foto profil dari user photoURL atau gunakan default
  const profileImageSource = user?.photoURL
    ? { uri: user.photoURL }
    : require("@/assets/images/avatar.jpg");

  return (
    <View>
      <View className="flex-row items-center mb-5">
        <Image
          source={profileImageSource}
          className="w-12 h-12 mr-3 border-2 rounded-full border-primary"
        />
        <View>
          <Text className="text-black font-poppins-medium">
            Hai {displayName}
          </Text>
          <Text className="font-poppins-medium text-grayText">
            Selamat Datang Kembali
          </Text>
        </View>
      </View>
    </View>
  );
}
