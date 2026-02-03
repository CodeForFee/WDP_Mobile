import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuthContext } from '@/contexts/authContext';
import { Loading } from '@/components/common';
import { useEffect } from 'react';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};
// reload lấy token từ secure store ra, props vào authContext , từ authContextn đẩy vào zustand truyền trong api gọi 

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to app
      router.replace('/(franchise-staff)');
    } else if (!isAuthenticated && !inAuthGroup && segments.length > 0) {
      // User is not authenticated but in protected screens, redirect to login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);
  if (isLoading) {
    return <Loading />;
  }


  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(franchise-staff)" />
          {/* <Stack.Screen name="(kitchen-staff)" />
          <Stack.Screen name="(coordinator)" /> */}
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
