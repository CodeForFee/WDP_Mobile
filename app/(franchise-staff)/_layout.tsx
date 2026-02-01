import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';


const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push('/(franchise-staff)')}
      style={{ marginLeft: 16, padding: 4 }}
    >
      <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );
}

export default function FranchiseLayout() {
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
      <Tabs.Screen name="index" options={{ headerShown: false }} />

      <Tabs.Screen
        name="orders/index"
        options={{
          title: 'Đơn đặt hàng',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="create-order"
        options={{
          title: 'Đặt hàng từ đầu bếp',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="inventory/index"
        options={{
          title: 'Kho',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />

      {/* Hidden tabs */}
      <Tabs.Screen
        name="receiving/index"
        options={{
          tabBarButton: () => null,
          title: 'Nhận hàng',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: () => null,
          title: 'Hồ sơ',
          headerShown: true,
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="orders/create"
        options={{
          tabBarButton: () => null,
          headerShown: true, // Assuming this might need a header too if navigated to
          title: 'Tạo đơn mới', // Adjust title as needed
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
      case 'create-order': return 'restaurant';
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
  // Hide bottom nav if not on 'index' (Home) screen
  const currentRouteName = state.routes[state.index].name;
  if (currentRouteName !== 'index') {
    return null;
  }

  const mainRoutes = state.routes.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* VIÊN THUỐC TRẮNG - VIỀN ĐẬM DỄ NHẬN BIẾT */}
      <View style={styles.pillContainer}>
        {mainRoutes.map((route: any, index: number) => (
          <TabItem
            key={route.key}
            route={route}
            isFocused={state.index === index}
            navigation={navigation}
          />
        ))}
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
    // VIỀN NGOÀI ĐẬM (Lấy màu đậm hơn chút để nổi bật)
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
    width: 62, // To hơn một chút để che viền cũ
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
  // VIỀN NGOÀI CÙNG CỦA NÚT CAM (Để khớp với viền Bottom Nav)
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