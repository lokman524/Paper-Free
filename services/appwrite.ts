import { Platform } from "react-native";
import { Client, Databases, ID, Query} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    platform: "com.no_paper.no_paper_app",
    databaseId: "686f801400210359c9af",
    userCollectionId: "686f80480032ea8c9486",
}

//add appwrite functions here if needed