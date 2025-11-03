import { Image, Text, View } from "react-native";

export default function ProfileHeader() {
    return(
        <View>
            <View className="flex-row items-center mb-5">
            <Image
            source={require("@/assets/images/avatar.jpg")}
            className="w-12 h-12 rounded-full mr-3 border-primary border-2"
            />
            <View>
            <Text className="font-poppins-medium text-black">Hai Asep</Text>
            <Text className="font-poppins-medium text-grayText">
                Selamat Datang Kembali
            </Text>
            </View>
        </View>
      </View>
    );
}


