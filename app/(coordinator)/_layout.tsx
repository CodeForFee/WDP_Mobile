import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../../src/constants/theme';

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
      case 'orders/index': return 'clipboard';
      case 'dispatch/index': return 'car';
      case 'issues/index': return 'alert-circle';
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
  const currentRouteName = state.routes[state.index].name;

  // Routes where the bottom bar is VISIBLE
  const visibleRoutes = ['index', 'orders/index', 'dispatch/index', 'issues/index'];

  if (!visibleRoutes.includes(currentRouteName)) {
    return null;
  }

  // Filter only main tabs
  const mainRoutes = state.routes.filter((route: any) =>
    visibleRoutes.includes(route.name)
  );

  return (
    <View style={styles.container}>
      {/* VIÊN THUỐC TRẮNG - VIỀN ĐẬM DỄ NHẬN BIẾT */}
      <View style={styles.pillContainer}>
        {mainRoutes.map((route: any, index: number) => {
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

export default function CoordinatorLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Ensure standard tab bar is hidden
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="orders/index" options={{ headerShown: false }} />
      <Tabs.Screen name="dispatch/index" options={{ headerShown: false }} />
      <Tabs.Screen name="issues/index" options={{ headerShown: false }} />

      {/* Hidden Screens */}
      <Tabs.Screen
        name="orders/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dispatch/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="delivery/index" // Folder
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar - moved to sidebar
        }}
      />
    </Tabs>
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
