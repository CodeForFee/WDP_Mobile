import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { LoadingSpinner, Button } from '@/components/common';
import { useOrder } from '@/hooks/useOrder';
import { OrderDetail } from '@/type';
import { OrderStatus } from '@/enum';
import { handleErrorApi } from '@/lib/errors';

// Màu banner theo status
const getStatusBannerColor = (status: string) => {
    switch (status) {
        case OrderStatus.PENDING:
            return { bg: '#FEF3C7', text: '#D97706' }; // amber
        case OrderStatus.APPROVED:
            return { bg: '#89A54D', text: '#FFF' }; // green
        case OrderStatus.REJECTED:
            return { bg: '#FEE2E2', text: '#DC2626' }; // red
        case OrderStatus.DELIVERED:
            return { bg: '#D1FAE5', text: '#059669' }; // emerald
        case OrderStatus.CANCELLED:
            return { bg: '#F3F4F6', text: '#6B7280' }; // gray
        default:
            return { bg: '#89A54D', text: '#FFF' };
    }
};

// Hiệu ứng giấy xé (Zigzag) - Tối ưu số lượng Triangle
const ZigzagDivider = () => (
    <View style={styles.zigzagContainer}>
        {[...Array(25)].map((_, i) => (
            <View key={i} style={styles.zigzagTriangle} />
        ))}
    </View>
);

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const data = await useOrder.getOrderById(id as string);
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy đơn hàng này?', [
            { text: 'Không', style: 'cancel' },
            {
                text: 'Có, hủy đơn',
                style: 'destructive',
                onPress: async () => {
                    setLoading(true);
                    try {
                        await useOrder.cancelOrder(order!.id);
                        Alert.alert('Thành công', 'Đã hủy đơn hàng', [
                            { text: 'OK', onPress: () => router.back() }
                        ]);
                    } catch (error) {
                        handleErrorApi({ error });
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    if (loading) return <View style={styles.center}><LoadingSpinner size={40} color="#89A54D" /></View>;
    if (!order) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header: có safe area top nên không cao quá, không dính status bar */}
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order details</Text>
                <View style={{ width: 40 }} /> 
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Status Banner - màu theo status */}
                {(() => {
                    const statusColors = getStatusBannerColor(order.status);
                    return (
                        <View style={[styles.statusBanner, { backgroundColor: statusColors.bg }]}>
                            <Text style={[styles.statusLabel, { color: statusColors.text }]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
                            <Text style={[styles.statusDate, { color: statusColors.text, opacity: 0.9 }]}>
                        {new Date(order.updatedAt).toLocaleString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                            </Text>
                        </View>
                    );
                })()}

                {/* Receipt Card */}
                <View style={styles.receiptMain}>
                    <Text style={styles.orderNumber}>№{order.id.slice(0, 8).toUpperCase()}</Text>
                    
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Image source={{ uri: item.product?.imageUrl }} style={styles.productImg} />
                            <Text style={styles.productInfo}>
                                <Text style={{ fontWeight: '800' }}>{item.quantityRequested} × </Text>
                                {item.product.name}
                            </Text>
                        </View>
                    ))}

                    <View style={styles.lineDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>The order items</Text>
                        <Text style={styles.summaryValue}>{order.items.length} items</Text>
                    </View>
                </View>

                <ZigzagDivider />

                {/* Store Info Section */}
                <View style={styles.storeSection}>
                    <Text style={styles.sectionHeading}>STORE INFORMATION</Text>
                    
                    <View style={styles.infoBlock}>
                        <View style={styles.iconBox}><Ionicons name="gift" size={18} color="#89A54D" /></View>
                        <View>
                            <Text style={styles.infoMainText}>{order.store.name}</Text>
                            <Text style={styles.infoSubText}>{order.store.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.infoBlock}>
                        <View style={[styles.iconBox, { backgroundColor: '#F1F8E9' }]}>
                            <Ionicons name="location" size={18} color="#89A54D" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoMainText}>{order.store.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Cancel - chỉ khi đơn đang PENDING */}
                {order.status === OrderStatus.PENDING && (
                    <View style={styles.cancelSection}>
                        <Button
                            title="Hủy đơn hàng"
                            onPress={handleCancelOrder}
                            variant="danger"
                            fullWidth
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8F4' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F7F8F4',
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
    scrollContent: { paddingTop: 20, paddingBottom: 40 },
    statusBanner: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        padding: 24,
        borderRadius: 28,
    },
    statusLabel: { color: '#FFF', fontSize: 26, fontWeight: '900' },
    statusDate: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, fontWeight: '600' },
    receiptMain: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        padding: 20,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    orderNumber: { fontSize: 17, fontWeight: '900', color: '#333', marginBottom: 20 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    productImg: { width: 52, height: 52, borderRadius: 14, marginRight: 14, backgroundColor: '#F0F0F0' },
    productInfo: { fontSize: 15, color: '#1A1A1A', flex: 1, fontWeight: '600' },
    lineDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { color: '#888', fontWeight: '600' },
    summaryValue: { fontWeight: '800', color: '#000' },
    zigzagContainer: {
        flexDirection: 'row',
        height: 12,
        backgroundColor: 'transparent',
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    zigzagTriangle: {
        width: 16,
        height: 16,
        backgroundColor: '#FFF',
        transform: [{ rotate: '45deg' }],
        marginTop: -8,
    },
    storeSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        padding: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingTop: 12,
    },
    sectionHeading: { fontSize: 12, color: '#BBB', fontWeight: '800', marginBottom: 18, letterSpacing: 1 },
    infoBlock: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 14 },
    cancelSection: { marginHorizontal: 16, marginTop: 24, marginBottom: 24 },
    iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center' },
    infoMainText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    infoSubText: { fontSize: 13, color: '#AAA', marginTop: 1 },
});