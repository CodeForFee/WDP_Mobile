import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

import { inventoryRequest } from '@/apiRequest/inventory';
import { useInventory } from '@/hooks/useInventory';
import { PAGINATION_DEFAULT } from '@/constant';
import { LoadingSpinner } from '@/components/common';

export default function InventoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { useStoreInventory } = useInventory();
    const { data: rawData = [], isLoading } = useStoreInventory(PAGINATION_DEFAULT);

    const inventoryItem = rawData.find(item => String(item.inventoryId || item.batchId) === id);

    if (isLoading) {
        return <View style={styles.center}><LoadingSpinner size={40} color={COLORS.primary} /></View>;
    }

    if (!inventoryItem) {
        return (
            <View style={styles.center}>
                <Text style={{ color: COLORS.textMuted }}>Không tìm thấy sản phẩm trong kho.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Combine actual data with premium mock detail fields
    const item = {
        id: id,
        name: inventoryItem.productName || 'Sản phẩm',
        calories: 749,
        price: 14,
        description: `Lô hàng: ${inventoryItem.batchCode}\nSKU: ${inventoryItem.sku}\nNgày hết hạn: ${new Date(inventoryItem.expiryDate).toLocaleDateString('vi-VN')}`,
        image: inventoryItem.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        nutrition: {
            Energy: '749kcal',
            Carbs: '36g',
            Fats: '44g',
            Proteins: '52g'
        },
        ingredients: [
            { name: 'Beef', image: 'https://images.unsplash.com/photo-1622219809260-ce065fc727f8?w=100&q=80' },
            { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80' },
            { name: 'Parmesan', image: 'https://images.unsplash.com/photo-1587332902636-f0840b33b000?w=100&q=80' },
            { name: 'Tomatoes', image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=100&q=80' },
            { name: 'Pickle', image: 'https://images.unsplash.com/photo-1605333550346-bf5f7f8924b1?w=100&q=80' },
        ]
    };

    return (
        <View style={styles.container}>
            {/* Hide Default Header */}
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.heroImage} />

                    {/* Custom Overlay Header */}
                    <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
                            <Ionicons name="pencil" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Content Body */}
                <View style={styles.contentContainer}>
                    {/* Title Row */}
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={styles.metaRow}>
                                <Ionicons name="flame" size={16} color={COLORS.error} />
                                <Text style={styles.caloriesText}>{item.calories} kcal</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.heartButton}>
                            <Ionicons name="heart" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{item.description}</Text>

                    {/* Price */}
                    <Text style={styles.price}>${item.price}</Text>

                    {/* Nutrition Grid */}
                    <View style={styles.nutritionRow}>
                        {Object.entries(item.nutrition).map(([key, value]) => (
                            <View key={key} style={styles.nutritionBox}>
                                <Text style={styles.nutritionLabel}>{key}</Text>
                                <Text style={styles.nutritionValue}>{value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Ingredients Section */}
                    <View style={styles.ingredientsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <TouchableOpacity>
                                <Ionicons name="grid-outline" size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ingredientsList}>
                            {item.ingredients.map((ing, i) => (
                                <View key={i} style={styles.ingredientItem}>
                                    <View style={styles.ingredientImageWrapper}>
                                        <Image source={{ uri: ing.image }} style={styles.ingredientImage} />
                                    </View>
                                    <Text style={styles.ingredientName}>{ing.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    {/* Allergens Section */}
                    <View style={styles.ingredientsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Allergens</Text>
                        </View>
                        <Text style={styles.description}>
                            Contains: Milk, Wheat, Eggs.
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}



const styles = StyleSheet.create({
    // ... (preserve previous styles until nutritionBox)
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF', // White background as per design
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    heartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.error,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caloriesText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    description: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    nutritionBox: {
        backgroundColor: '#F5F5F5', // Softer background
        borderRadius: RADIUS.lg, // More rounded
        paddingVertical: SPACING.md,
        width: (width - SPACING.lg * 2 - SPACING.md * 3) / 4,
        alignItems: 'center',
        // No border
    },
    nutritionLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    nutritionValue: {
        fontSize: 13, // Slightly larger
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    ingredientsSection: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    ingredientsList: {
        paddingRight: SPACING.lg,
    },
    ingredientItem: {
        alignItems: 'center',
        marginRight: SPACING.lg,
    },
    ingredientImageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 16, // Softer corners
        backgroundColor: '#FFF', // White card
        padding: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingredientImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    ingredientName: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
