import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(franchise-staff)" />
        <Stack.Screen name="(kitchen-staff)" />
        <Stack.Screen name="(coordinator)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
