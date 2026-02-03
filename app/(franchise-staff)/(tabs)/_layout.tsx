import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 80;
const TAB_BAR_WIDTH = width;

function BackButton() {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push('/(franchise-staff)/(tabs)')}
            style={{ marginLeft: 16, padding: 4 }}
        >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
    );
}

export default function FranchiseTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { display: 'none' }, // Using custom tab bar
                headerStyle: {
                    backgroundColor: COLORS.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
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
            <Tabs.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventory',
                    headerShown: true,
                    headerLeft: () => <BackButton />
                }}
            />

            {/* Center Tab Placeholders */}
            <Tabs.Screen
                name="orders"
                options={{
                    tabBarButton: () => null, // Hidden from standard tab logic but used in custom bar
                    title: 'Orders',
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="receiving"
                options={{
                    title: 'Receive Goods',
                    headerShown: true,
                    headerLeft: () => <BackButton />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: true,
                    headerLeft: () => <BackButton />
                }}
            />
        </Tabs>
    );
}

// Custom Tab Bar Component
function CustomTabBar({ state, navigation }: any) {
    // Hide bottom nav if not on main tabs
    // In this layout, ALL routes are main tabs.
    // But strictly we only have these 5.

    return (
        <View style={styles.container}>
            {/* Background Curve */}
            <View style={styles.svgContainer}>
                <TabShape />
            </View>

            {/* Tab Items */}
            <View style={styles.tabsContainer}>
                {/* Left Group */}
                <TabItem
                    icon="restaurant"
                    label="Home"
                    isActive={state.index === 0} // Index 0 is 'index'
                    onPress={() => navigation.navigate('index')}
                />
                <TabItem
                    icon="cube"
                    label="Inventory"
                    isActive={state.routes[state.index].name === 'inventory'}
                    onPress={() => navigation.navigate('inventory')}
                />

                {/* Center Floating Button */}
                <View style={styles.centerButtonContainer}>
                    <TouchableOpacity
                        style={styles.centerButton}
                        onPress={() => navigation.navigate('orders')}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="receipt" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Right Group */}
                <TabItem
                    icon="bus"
                    label="Receive"
                    isActive={state.routes[state.index].name === 'receiving'}
                    onPress={() => navigation.navigate('receiving')}
                />
                <TabItem
                    icon="person"
                    label="Profile"
                    isActive={state.routes[state.index].name === 'profile'}
                    onPress={() => navigation.navigate('profile')}
                />
            </View>
        </View>
    );
}

function TabItem({ icon, label, isActive, onPress }: any) {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(isActive ? 1.1 : 1) }],
        };
    });

    return (
        <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <Ionicons
                    name={isActive ? icon : `${icon}-outline`}
                    size={24}
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                />
            </Animated.View>
            <Text style={[styles.tabLabel, { color: isActive ? COLORS.primary : COLORS.textMuted }]}>
                {label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
        </TouchableOpacity>
    );
}

// SVG Shape
const TabShape = () => {
    const height = TAB_HEIGHT;
    const width = TAB_BAR_WIDTH;
    const curveWidth = 95;
    const center = width / 2;

    const path = `
    M0,0
    L${center - curveWidth},0
    C${center - curveWidth * 0.5},0 ${center - curveWidth * 0.35},${height * 0.5} ${center},${height * 0.5}
    C${center + curveWidth * 0.35},${height * 0.5} ${center + curveWidth * 0.5},0 ${center + curveWidth},0
    L${width},0
    L${width},${height}
    L0,${height}
    Z
  `;

    return (
        <Svg width={width} height={height} style={styles.shadow}>
            <Path
                d={path}
                fill="#FFFFFF"
                stroke={COLORS.border}
                strokeWidth={1}
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: TAB_HEIGHT,
        backgroundColor: 'transparent',
        elevation: 0,
    },
    svgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 0,
    },
    shadow: {},
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100%',
        paddingHorizontal: 10,
        paddingTop: 12,
        zIndex: 1,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
    activeDot: {
        marginTop: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    centerButtonContainer: {
        top: -25,
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    centerButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.lg,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
});
