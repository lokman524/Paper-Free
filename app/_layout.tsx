import { Stack } from "expo-router";
import './globals.css';
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true}/>
      <Stack >
        <StatusBar hidden={true} />
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="(pages)"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="(login)"
          options={{headerShown: false}}
        />
      </Stack>
    </>
  )
}

