import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, Button } from '@/components/common';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Mock Data
    const order = {
        id: id || '34619',
        createdAt: '6 August, 1:11 pm',
        status: 'Cooking',
        statusStep: 1, // 0: New, 1: Cooking, 2: Ready, 3: Picked Up
        customer: {
            name: 'Zaki Medina',
            role: 'Eatstro', // Or Driver?
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
        items: [
            {
                id: '1',
                name: 'Classic Burger',
                calories: '450 cal',
                description: 'Homemade beef cutlet with signature...',
                price: 14,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                quantity: 1,
                spicy: 2, // 1-3
            },
            {
                id: '2',
                name: 'Classic Burger',
                calories: '450 cal',
                description: 'Homemade beef cutlet with signature...',
                price: 14,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                quantity: 1,
                spicy: 3,
            }
        ]
    };

    const renderTimeline = (currentStep: number) => {
        const steps = [
            { label: 'New Order', icon: 'star' },
            { label: 'Cooking', icon: 'restaurant' },
            { label: 'Ready', icon: 'checkmark-circle' },
            { label: 'Picked Up', icon: 'cube' },
        ];

        return (
            <View style={styles.timelineContainer}>
                {steps.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isLast = index === steps.length - 1;
                    return (
                        <View key={index} style={styles.timelineStepWrapper}>
                            <View style={styles.timelineStep}>
                                <View style={[
                                    styles.stepIconContainer,
                                    isActive ? styles.stepActive : styles.stepInactive,
                                ]}>
                                    <Ionicons
                                        name={step.icon as any}
                                        size={14}
                                        color={isActive ? COLORS.textLight : COLORS.textMuted}
                                    />
                                </View>
                                <Text style={[
                                    styles.stepLabel,
                                    isActive ? styles.stepLabelActive : styles.stepLabelInactive
                                ]}>
                                    {step.label}
                                </Text>
                            </View>
                            {!isLast && (
                                <View style={[
                                    styles.stepLine,
                                    index < currentStep ? styles.stepLineActive : styles.stepLineInactive
                                ]} />
                            )}
                        </View>
                    )
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: `Order № ${order.id}`,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: COLORS.background },
                    headerRight: () => (
                        <TouchableOpacity style={{
                            backgroundColor: COLORS.primary, // Green
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: RADIUS.md,
                            marginRight: 8
                        }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Finished</Text>
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header Info */}
                <View style={styles.headerInfo}>
                    <View>
                        <Text style={styles.label}>Order time</Text>
                        <Text style={styles.value}>{order.createdAt}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                </View>

                {/* Timeline */}
                <View style={styles.section}>
                    {renderTimeline(order.statusStep)}
                </View>

                {/* Customer / Driver */}
                <View style={styles.customerSection}>
                    <Text style={styles.sectionTitle}>Eatstro</Text>
                    <TouchableOpacity style={styles.chatButton}>
                        <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
                <Card style={styles.customerCard}>
                    <Image source={{ uri: order.customer.image }} style={styles.customerImage} />
                    <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>{order.customer.name}</Text>
                        <View style={styles.customerRoleBadge}>
                            <Text style={styles.customerRoleText}>{order.customer.role}</Text>
                        </View>
                    </View>
                </Card>

                {/* Items List */}
                <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Items List</Text>
                <View style={styles.itemsGrid}>
                    {order.items.map((item, index) => (
                        <Card key={index} style={styles.itemCard}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.qtyBadge}>
                                    <Text style={styles.qtyText}>{item.calories}</Text>
                                </View>
                                <TouchableOpacity style={styles.favButton}>
                                    <Ionicons name="heart" size={12} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.itemContent}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <View style={styles.stockBadge}>
                                        <Text style={styles.stockText}>23/25</Text>
                                    </View>
                                </View>
                                <View style={styles.fireRow}>
                                    <Ionicons name="flame" size={12} color={COLORS.error} />
                                    <Text style={styles.calText}>{item.calories}</Text>
                                </View>
                                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceText}>${item.price}</Text>
                                    <View style={styles.pepperRow}>
                                        <Ionicons name="nutrition" size={14} color={COLORS.error} />
                                        {/* Mocking peppers/spicy level icons */}
                                        <Ionicons name="nutrition-outline" size={14} color="#CCC" />
                                    </View>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.base,
        paddingBottom: 100,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    value: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statusBadge: {
        backgroundColor: COLORS.primary, // Or #8BC34A
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
    },
    statusText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // Timeline
    timelineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        ...SHADOWS.sm,
    },
    timelineStepWrapper: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    timelineStep: {
        alignItems: 'center',
        zIndex: 2,
        width: '100%',
    },
    stepIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    stepActive: {
        backgroundColor: COLORS.primary,
    },
    stepInactive: {
        backgroundColor: COLORS.border,
    },
    stepLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    stepLabelActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    stepLabelInactive: {
        color: COLORS.textMuted,
    },
    stepLine: {
        position: 'absolute',
        top: 12,
        left: '50%',
        width: '100%',
        height: 2,
        zIndex: 1,
    },
    stepLineActive: {
        backgroundColor: COLORS.primaryLight,
    },
    stepLineInactive: {
        backgroundColor: COLORS.border,
    },
    // Customer
    customerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    chatButton: {
        padding: 4,
    },
    customerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderRadius: RADIUS.lg,
    },
    customerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: SPACING.md,
    },
    customerInfo: {
        justifyContent: 'center',
    },
    customerName: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    customerRoleBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
        alignSelf: 'flex-start',
    },
    customerRoleText: {
        fontSize: 10,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    // Items Grid
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    itemCard: {
        width: '47%', // roughly half
        padding: 0,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        marginBottom: SPACING.xs,
        backgroundColor: '#FFF',
        ...SHADOWS.sm,
    },
    imageContainer: {
        height: 120,
        width: '100%',
        backgroundColor: COLORS.backgroundTertiary,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    qtyBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
    },
    qtyText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    favButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    itemContent: {
        padding: SPACING.md,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    stockBadge: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 8,
        color: COLORS.textPrimary,
    },
    itemName: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
    },
    fireRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 6,
    },
    calText: {
        fontSize: 10,
        color: COLORS.error,
    },
    itemDesc: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: 8,
        height: 28,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    pepperRow: {
        flexDirection: 'row',
        gap: 2,
    },
});
