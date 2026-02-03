import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, LoadingSpinner } from '@/components/common';
import { useOrder } from '@/hooks/useOrder';
import { OrderDetail } from '@/type';
import { OrderStatus } from '@/enum';
import { handleErrorApi } from '@/lib/errors';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id && typeof id === 'string') {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        if (!id || typeof id !== 'string') {
            console.log('[ORDER DETAIL] Invalid ID:', id);
            setError("ID đơn hàng không hợp lệ");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        console.log('[ORDER DETAIL] Fetching order:', id);
        try {
            const data = await useOrder.getOrderById(id);
            console.log('[ORDER DETAIL] Success:', data);
            setOrder(data);
        } catch (error: any) {
            console.error('[ORDER DETAIL] Error:', error);
            const errorMsg = error?.payload?.message || error?.message || "Không thể tải chi tiết đơn hàng";
            setError(errorMsg);
            handleErrorApi({ error });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;
        Alert.alert("Confirm", "Are you sure you want to cancel this order?", [
            { text: "No", style: 'cancel' },
            {
                text: "Yes", style: 'destructive', onPress: async () => {
                    setLoading(true);
                    try {
                        await useOrder.cancelOrder(order.id);
                        Alert.alert("Success", "Order cancelled", [
                            { text: "OK", onPress: () => router.back() }
                        ]);
                    } catch (error) {
                        handleErrorApi({ error });
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size={48} color={COLORS.primary} />
                    <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !order) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
                    <Text style={styles.errorTitle}>Không thể tải đơn hàng</Text>
                    <Text style={styles.errorMessage}>{error || "Đơn hàng không tồn tại"}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
                        <Text style={styles.retryButtonText}>Thử lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return { bg: '#FEF3C7', text: '#D97706' };
            case OrderStatus.DELIVERED:
                return { bg: '#D1FAE5', text: '#059669' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280' };
        }
    };

    const statusColor = getStatusColor(order.status);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen
                options={{
                    title: `Order #${order.id.slice(0, 8)}...`,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: COLORS.background },
                }}
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header Info */}
                <Card style={styles.headerCard}>
                    <View style={styles.headerInfo}>
                        <View style={styles.headerInfoItem}>
                            <Text style={styles.label}>Order ID</Text>
                            <Text style={styles.value}>{order.id}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                            <Text style={[styles.statusText, { color: statusColor.text }]}>
                                {order.status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerInfoRow}>
                        <View style={styles.headerInfoItem}>
                            <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                            <Text style={styles.label}>Created</Text>
                            <Text style={styles.value}>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.headerInfoItem}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                            <Text style={styles.label}>Delivery Date</Text>
                            <Text style={styles.value}>
                                {new Date(order.deliveryDate).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    {order.note && (
                        <View style={styles.noteSection}>
                            <Text style={styles.label}>Note</Text>
                            <Text style={styles.noteText}>{order.note}</Text>
                        </View>
                    )}
                </Card>

                {/* Store Info */}
                {order.store && (
                    <Card style={styles.storeCard}>
                        <Text style={styles.sectionTitle}>Store Information</Text>
                        <View style={styles.storeInfo}>
                            <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
                            <View style={styles.storeDetails}>
                                <Text style={styles.storeName}>{order.store.name}</Text>
                                <Text style={styles.storeAddress}>{order.store.address}</Text>
                                <Text style={styles.storeManager}>
                                    Manager: {order.store.managerName}
                                </Text>
                                <Text style={styles.storePhone}>{order.store.phone}</Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Items List */}
                <Text style={styles.sectionTitle}>Order Items</Text>
                {order.items.map((item, index) => (
                    <Card key={index} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                            <View style={styles.itemIcon}>
                                <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.product.name}</Text>
                                <Text style={styles.itemSku}>SKU: {item.product.sku}</Text>
                                <Text style={styles.itemUnit}>Unit: {item.product.unit}</Text>
                            </View>
                            <View style={styles.itemQuantity}>
                                <Text style={styles.quantityLabel}>Requested</Text>
                                <Text style={styles.quantityValue}>{item.quantityRequested}</Text>
                                {item.quantityApproved && (
                                    <>
                                        <Text style={styles.quantityLabel}>Approved</Text>
                                        <Text style={styles.quantityApproved}>{item.quantityApproved}</Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </Card>
                ))}

                {/* Action Buttons */}
                {order.status === OrderStatus.PENDING && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelOrder}
                        >
                            <Ionicons name="close-circle" size={20} color={COLORS.error} />
                            <Text style={styles.cancelButtonText}>Cancel Order</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.md,
    },
    loadingText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.textMuted,
        marginTop: SPACING.sm,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        gap: SPACING.md,
    },
    errorTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
    },
    errorMessage: {
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        minWidth: 120,
    },
    retryButtonText: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        textAlign: 'center',
    },
    backButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        minWidth: 120,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        textAlign: 'center',
    },
    content: {
        padding: SPACING.base,
    },
    headerCard: {
        marginBottom: SPACING.md,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    headerInfoRow: {
        flexDirection: 'row',
        gap: SPACING.lg,
        marginTop: SPACING.sm,
    },
    headerInfoItem: {
        flex: 1,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: 4,
        marginTop: 4,
    },
    value: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
    },
    statusText: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        textTransform: 'uppercase',
    },
    noteSection: {
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    noteText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textPrimary,
        marginTop: SPACING.xs,
    },
    storeCard: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    storeInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
    },
    storeDetails: {
        flex: 1,
    },
    storeName: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    storeAddress: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
    storeManager: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
    storePhone: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textMuted,
    },
    itemCard: {
        marginBottom: SPACING.md,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
    },
    itemIcon: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    itemSku: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    itemUnit: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
    },
    itemQuantity: {
        alignItems: 'flex-end',
    },
    quantityLabel: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    quantityValue: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
    },
    quantityApproved: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.success || COLORS.primary,
        marginTop: SPACING.xs,
    },
    actionButtons: {
        marginTop: SPACING.lg,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.error + '20',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        gap: SPACING.sm,
    },
    cancelButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.error,
    },
});
