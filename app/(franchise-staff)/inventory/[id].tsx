import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../src/constants/theme';
import { Header } from '../../../src/components/common';

export default function InventoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Header title={`Item #${id}`} showBack onBack={() => router.back()} />
            <View style={styles.content}>
                <Text style={styles.text}>Inventory Item Details for ID: {id}</Text>
                <Text style={styles.subText}>Content coming soon...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.textPrimary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        marginBottom: SPACING.sm,
    },
    subText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textSecondary,
    },
});
