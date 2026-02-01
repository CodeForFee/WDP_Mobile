import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;

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

export default function KitchenLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: COLORS.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.textPrimary,
        },
        headerTitleAlign: 'center',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* Primary Tabs */}
      <Tabs.Screen name="index" options={{ headerShown: false }} />

      <Tabs.Screen
        name="orders/index"
        options={{
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="production/index"
        options={{
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="inventory/index"
        options={{
          headerShown: false,
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: () => null,
          title: 'Hồ sơ',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
    </Tabs>
  );
}

function TabItem({ route, isFocused, navigation }: any) {
  // Hiệu ứng trượt thẳng dứt khoát lên trên
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(isFocused ? -25 : 0, { duration: 250, easing: Easing.out(Easing.quad) }) }],
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0),
    transform: [{ translateY: withTiming(isFocused ? -25 : 20, { duration: 250, easing: Easing.out(Easing.quad) }) }],
  }));

  const getIconName = (name: string): any => {
    switch (name) {
      case 'index': return 'home';
      case 'orders/index': return 'list';
      case 'production/index': return 'flame';
      case 'inventory/index': return 'cube';
      default: return 'help-circle';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(route.name)}
      style={styles.tabItem}
      activeOpacity={1}
    >
      {/* VÒNG TRÒN CAM CÓ VIỀN TRẮNG DÀY (Tạo hiệu ứng ôm viền) */}
      <Animated.View style={[styles.activeCircle, animatedCircleStyle]}>
        {/* Lớp viền phụ màu xám/đậm trùng màu viền Bottom Nav */}
        <View style={styles.outerBorderRing} />
      </Animated.View>

      <Animated.View style={animatedIconStyle}>
        <Ionicons
          name={isFocused ? getIconName(route.name) : `${getIconName(route.name)}-outline`}
          size={24}
          color={isFocused ? '#FFF' : COLORS.textMuted}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: any) {
  // Hide bottom nav if we are deeper in the stack (e.g., details screen) OR specifically on 'inventory/index'

  // Get the current route name
  const currentRouteName = state.routes[state.index].name;

  // Define routes where the tab bar should be VISIBLE
  // User request: Show on [index, orders, production], HIDE on [inventory]
  const visibleRoutes = ['index', 'orders/index', 'production/index'];

  if (!visibleRoutes.includes(currentRouteName)) {
    return null;
  }

  // Filter only the main tabs we want to show icons for (including inventory, so it appears in the list but disappears when selected? NO.)
  // Wait, if it's hidden ON inventory, it means when I click "Inventory", the bar disappears.
  // The icons displayed should still include Inventory so I can navigate TO it.

  const mainRoutes = state.routes.filter((route: any) =>
    ['index', 'orders/index', 'production/index', 'inventory/index'].includes(route.name)
  );

  return (
    <View style={styles.container}>
      {/* VIÊN THUỐC TRẮNG - VIỀN ĐẬM DỄ NHẬN BIẾT */}
      <View style={styles.pillContainer}>
        {mainRoutes.map((route: any, index: number) => {
          // Find the actual index in the state.routes array to determine focus
          const actualIndex = state.routes.indexOf(route);
          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={state.index === actualIndex}
              navigation={navigation}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: TAB_BAR_WIDTH,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    // VIỀN NGOÀI ĐẬM
    borderWidth: 2.5,
    borderColor: '#D1D1D1',
    ...SHADOWS.lg,
    elevation: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeCircle: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.primary,
    // VIỀN TRẮNG CHÍNH
    borderWidth: 6,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
    elevation: 10,
  },
  // VIỀN NGOÀI CÙNG CỦA NÚT CAM
  outerBorderRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#D1D1D1', // Cùng màu với viền của pillContainer
    zIndex: -1,
  },
});
