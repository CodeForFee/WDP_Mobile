import React, { use } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ViewStyle,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SIZES, TYPOGRAPHY, SHADOWS, RADIUS } from '../../constants/theme';


interface HeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    showAvatar?: boolean;
    avatarUrl?: string;
    onAvatarPress?: () => void;
    rightElement?: React.ReactNode;
    leftElement?: React.ReactNode;
    variant?: 'default' | 'transparent' | 'minimal';
    style?: ViewStyle;
}

export function Header({
    title,
    subtitle,
    showBack = false,
    onBack,
    showAvatar = false,
    avatarUrl,
    onAvatarPress,
    rightElement,
    leftElement,
    variant = 'default',
    style,
}: HeaderProps) {
    return (
        <SafeAreaView style={[
            styles.safeArea,
            variant === 'default' && styles.defaultContainer,
            variant === 'transparent' && styles.transparentContainer,
            variant === 'minimal' && styles.minimalContainer
        ]}>
            <View style={[styles.container, style]}>
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons
                                name="arrow-back"
                                size={SIZES.iconMd}
                                color={COLORS.textPrimary}
                            />
                        </TouchableOpacity>
                    )}
                    {leftElement}
                </View>

                <View style={styles.centerSection}>
                    {title && (
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                <View style={styles.rightSection}>
                    {rightElement}
                    {showAvatar && (
                        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={SIZES.iconSm} color={COLORS.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

interface StoreHeaderProps {
    storeName: string;
    storeId: string;
    avatarUrl?: string;
    onAvatarPress?: () => void;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export function StoreHeader({
    storeName,
    storeId,
    avatarUrl,
    onAvatarPress,
    onMenuPress,
    style,
}: StoreHeaderProps) {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.background }]}>
            <View style={[styles.storeHeader, style]}>
                <View style={styles.storeContent}>
                    <View style={styles.storeInfo}>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.storeName} numberOfLines={1}>{storeName}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={12} color={COLORS.primary} />
                            <Text style={styles.storeId}>{storeId}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                        <Ionicons name="menu-outline" size={32} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 0 : 0, // Add explicit padding for Android status bar
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: SIZES.headerHeight,
        paddingHorizontal: SPACING.base,
        zIndex: 10,
    },
    // Default variant
    defaultContainer: {
        backgroundColor: COLORS.background,
    },
    // Transparent variant
    transparentContainer: {
        backgroundColor: 'transparent',
    },
    // Minimal variant
    minimalContainer: {
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    // Sections
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 48,
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 48,
        justifyContent: 'flex-end',
        gap: SPACING.sm,
    },

    // Elements
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    avatarContainer: {
        marginLeft: SPACING.sm,
        ...SHADOWS.sm,
    },
    avatar: {
        width: SIZES.avatarMd,
        height: SIZES.avatarMd,
        borderRadius: SIZES.avatarMd / 2,
        borderWidth: 2,
        borderColor: COLORS.cardBackground,
    },
    avatarPlaceholder: {
        width: SIZES.avatarMd,
        height: SIZES.avatarMd,
        borderRadius: SIZES.avatarMd / 2,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.cardBackground,
    },

    // Store Header
    storeHeader: {
        paddingHorizontal: SPACING.base,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.md,
    },
    storeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        padding: SPACING.xs,
        marginLeft: SPACING.sm,
    },
    storeInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    storeName: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    storeId: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
});
