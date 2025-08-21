import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Button, FlatList, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Image } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import useAuthStore from "@/store/auth.store";
import Dashboard from "@/components/Dashboard";
import { Ionicons } from '@expo/vector-icons'; // For settings icon

export default function Index() {
  const router = useRouter();
  //const [user, setUser] = useState<string>("null");
  const user = useAuthStore(state => state.user);
  const fetchAuthenticatedUser = useAuthStore(state => state.fetchAuthenticatedUser);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  //Commenting this because Expo Go does not support persistent cookies or local storage for custom native modules like Appwrite, so Appwrite sessions will not persist after reload in Expo Go
  //In short, every time i reload the app i will be directed to the login page. So i commented this out for now.
  /* if(!isAuthenticated){ 
    return <Redirect href="/(login)/login" />
  } */

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="topbar">
        <View>
          <Text className="big-title">Hello, {user?.name || user?.email}!</Text>
          <Text className="small-title">Welcome Back.</Text>
          <Dashboard />
        </View>
        <Pressable className="mb-12 mx-4" onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#222" />
        </Pressable>
      </View>

      {/* Divider */}
      <View className="my-6 mx-6 border-b border-gray-200" />

      {/* Card Row */}
      <View className="page-content">
        <Pressable
          onPress={() => router.push("/subject_selection")}
          className="card bg-orange-400 mb-2"
          style={{ elevation: 4 }}
        >
          <Text className="text-white text-lg font-bold mb-2">Question Bank</Text>
          <Ionicons name="help-circle-outline" size={36} color="white" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/saved")}
          className="card bg-red-400 mb-2"
          style={{ elevation: 4 }}
        >
          <Text className="text-white text-lg font-bold mb-2">Error Books</Text>
          <Ionicons name="checkmark-done-outline" size={36} color="white" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/learning_record")}
          className="card bg-green-400 mb-2"
          style={{ elevation: 4 }}
        >
          <Text className="text-white text-lg font-bold mb-2">Learning Records</Text>
          <Ionicons name="book-outline" size={36} color="white" />
        </Pressable>
        {<Button title="go to login page (for debug)" onPress={() => router.push("/(login)/login")}/>}
      </View>
    </SafeAreaView>
  );
}
