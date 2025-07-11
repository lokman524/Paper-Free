import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {

  
  return (
    <>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,          // Hide all headers
            animation: 'none',           // Disable transition animations
            gestureEnabled: false,       // Disable swipe gestures
            contentStyle: {
              backgroundColor: 'transparent', // Make sure no background shows
            },
          }}
        >
          {/* Your screens will be automatically inserted here */}
        </Stack>
      </View>
    </>
  );
}