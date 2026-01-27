import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

function TabBarIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  // Fallback for valid Ionicons if direct name is passed
  const iconName = focused ? name : `${name}-outline` as any;

  return (
    <View style={[
      styles.iconContainer,
      focused && styles.iconActive
    ]}>
      <Ionicons name={iconName} size={24} color={focused ? COLORS.textLight : color} />
    </View>
  );
}

export default function KitchenLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="list" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="flame" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="cube" color={color} focused={focused} />,
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
  tabBar: {
    position: 'absolute',
    bottom: 30, // Increased bottom spacing
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 35,
    borderTopWidth: 0,
    ...SHADOWS.lg,
    elevation: 10,
    paddingBottom: 0,
  },
  tabBarItem: {
    height: 70,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
    transform: [{ translateY: -5 }],
  },
});
