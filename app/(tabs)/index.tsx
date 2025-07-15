import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Button, FlatList, ScrollView, Text, View } from "react-native";
import { Image } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import useAuthStore from "@/store/auth.store";
import Dashboard from "@/components/Dashboard";

export default function Index() {
  const router = useRouter();
  //const [user, setUser] = useState<string>("null");
  const {isAuthenticated, user, fetchAuthenticatedUser} = useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  //Commenting this because Expo Go does not support persistent cookies or local storage for custom native modules like Appwrite, so Appwrite sessions will not persist after reload in Expo Go
  //In short, every time i reload the app i will be directed to the login page. So i commented this out for now.
  /* if(!isAuthenticated){ 
    return <Redirect href="/(login)/login" />
  } */

  return (
    <View className="flex-1 bg-primary pt-10">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: "100%" }}>
        <Text className="text-5xl text-white font-bold mt-5 mb-3">Hello, {user?.name || user?.email}!</Text>
        <Text className="text-white text-xl mb-5">What do you want to do today?</Text>
        <Dashboard />
        <Button title="題庫" onPress={() => router.push("/subject_selection")} />
        <Button title="錯題簿" onPress={() => router.push("/saved")} />
        <Button title="學習記錄" onPress={() => router.push("/learning_record")} />
        <Button title="設定" onPress={() => router.push("/settings")} />
        {<Button title="go to login page (for debug)" onPress={() => router.push("/(login)/login")}/>}
      </ScrollView>
    </View>
  );
}
