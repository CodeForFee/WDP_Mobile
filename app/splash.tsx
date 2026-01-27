import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../src/constants/theme';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect after 2 seconds
        const timer = setTimeout(() => {
            router.replace('/(auth)/login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="restaurant" size={48} color={COLORS.textLight} />
                    </View>
                </View>

                {/* Brand Name */}
                <View style={styles.brandContainer}>
                    <Text style={styles.brandName}>
                        Crispy<Text style={styles.brandPro}>Pro</Text>
                    </Text>
                    <Text style={styles.tagline}>FRANCHISE OPERATIONS</Text>
                </View>

                {/* Loading */}
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingDots}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={[styles.dot, styles.dotActive]} />
                    </View>
                </View>
            </View>

            <Text style={styles.footer}>Powered by Franchisee Tech</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING['2xl'],
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: SPACING['2xl'],
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: SPACING['3xl'],
    },
    brandName: {
        fontSize: TYPOGRAPHY.fontSize['4xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
        letterSpacing: 1,
    },
    brandPro: {
        color: COLORS.primaryDark,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
    },
    tagline: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        letterSpacing: 3,
        marginTop: SPACING.sm,
    },
    loadingContainer: {
        marginTop: SPACING.xl,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    dotActive: {
        backgroundColor: COLORS.primary,
    },
    footer: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: SPACING['2xl'],
    },
});
