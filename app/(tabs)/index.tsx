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

export default function Index() {
  const router = useRouter();
  //const [user, setUser] = useState<string>("null");
  const {isAuthenticated, user} = useAuthStore();

  /* useEffect(() => {

    async function getAndSetUser() {
      
      if (!isAuthenticated) {
        // If no user is found, redirect to login
        console.log("not is authenticated")
        router.replace("/login"); 
      }
      else {
        console.log("is authenticated", JSON.stringify(user, null, 2))
        // If user is found, set the user state
        // Update: no need to set user state i dun even know why im miserable pls help me
      }
    }

    getAndSetUser();


  }, []); */

  if(!isAuthenticated){ 
    return <Redirect href="/(login)/login" />
  }

  return (
    <View className="flex-1 bg-primary pt-10">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: "100%" }}>
        <Text className="text-5xl text-white font-bold mt-5 mb-3">Hello, {user?.email}!</Text>
        <Text className="text-white text-xl mb-5">What do you want to do today?</Text>
        <Button title="題庫" onPress={() => router.push("/subject_selection")} />
        <Button title="錯題簿" onPress={() => router.push("/saved")} />
        <Button title="學習記錄" onPress={() => router.push("/learning_record")} />
        <Button title="設定" onPress={() => router.push("/settings")} />
        {<Button title="go to login page (for debug)" onPress={() => router.push("/(login)/login")}/>}
      </ScrollView>
    </View>
  );
}
