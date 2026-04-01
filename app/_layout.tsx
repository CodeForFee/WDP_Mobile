import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuthContext } from '@/contexts/authContext';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/common';
import { useSessionStore } from '@/stores/storeSession';
import QueryClientProviderWrapper from '@/components/QueryClientProviderWrapper';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function RootLayoutNav() {
  const { isAuthenticated } = useAuthContext();
  const { hydrate, isLoading } = useSessionStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Mark as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydrate session on mount
  useEffect(() => {
    hydrate();
  }, []);

  // Navigate only after mounted and session is ready
  useEffect(() => {
    if (!mounted || isLoading) return;

    if (isAuthenticated) {
      router.replace('/(franchise-staff)/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [mounted, isAuthenticated, isLoading]);

  if (isLoading) return <Loading />;


  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(franchise-staff)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}



export default function RootLayout() {
  return (
    <QueryClientProviderWrapper>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProviderWrapper>
  );
}
