import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ marginLeft: 16, padding: 4 }}
    >
      <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );
}

export default function FranchiseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.textPrimary,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />

      {/* Detail Screens */}
      <Stack.Screen
        name="inventory/[id]"
        options={{
          title: 'Item Details',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />

      <Stack.Screen
        name="orders/cart"
        options={{
          title: 'Confirm Order',
          headerShown: false,
          headerLeft: () => <BackButton />
        }}
      />

      <Stack.Screen
        name="orders/success"
        options={{
          headerShown: false,
          gestureEnabled: false // Prevent swipe back
        }}
      />

      <Stack.Screen
        name="orders/create"
        options={{
          title: 'New Order',
          headerShown: false,
          headerLeft: () => <BackButton />
        }}
      />

      <Stack.Screen
        name="orders/[id]"
        options={{
          title: 'Order Details',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
    </Stack>
  );
}