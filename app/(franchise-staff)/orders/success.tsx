import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LoadingSpinner } from '@/components/common';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useOrder } from '@/hooks/useOrder';
import { OrderDetail } from '@/type';

export default function OrderSuccessScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetails(String(id));
        else setLoading(false);
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const data = await useOrder.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <LoadingSpinner size={48} color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Icon thành công */}
                <View style={styles.successIconWrapper}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="cart-outline" size={38} color="#333" />
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={14} color="#FFF" />
                        </View>
                    </View>
                </View>

                <Text style={styles.title}>Order placed</Text>
                <Text style={styles.subtitle}>
                    Your order has been sent to <Text style={styles.boldText}>"{order?.store?.name || 'Central Kitchen'}"</Text> nơi nhân viên sẽ chuẩn bị và giao hàng cho bạn sớm nhất.
                </Text>

                {/* Note Box - Luôn hiển thị vì là text tĩnh hướng dẫn */}
                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                        <Text style={styles.boldText}>Important:</Text> Bạn sẽ nhận được thông báo đẩy khi trạng thái đơn hàng thay đổi. Vui lòng bật thông báo để cập nhật lộ trình.
                    </Text>
                </View>

                {/* Card tổng hợp - Chỉ hiện nếu có data cơ bản */}
                {order && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.storeRow}>
                                <View style={styles.storeIconContainer}>
                                    <Ionicons name="storefront" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.storeName}>{order.store?.name || 'My Store'}</Text>
                            </View>
                            {/* Chỉ hiện giá nếu > 0 */}
                            {order.totalAmount > 0 && (
                                <Text style={styles.totalPrice}>{order.totalAmount.toLocaleString()}đ</Text>
                            )}
                        </View>

                        {/* Chỉ hiện Time Row nếu có deliveryDate */}
                        {order.deliveryDate && (
                            <View style={styles.timeRow}>
                                <View style={styles.timeInfo}>
                                    <Ionicons name="time-outline" size={20} color="#666" />
                                    <Text style={styles.timeText}>
                                        {new Date(order.deliveryDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                    </Text>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.footerRow}>
                            {/* Chỉ hiện danh sách ảnh nếu có items */}
                            <View style={styles.avatarStack}>
                                {order.items?.slice(0, 5).map((item, index) => (
                                    <View
                                        key={index}
                                        style={[styles.miniAvatar, { left: index * 22, zIndex: 10 - index }]}
                                    >
                                        <Image
                                            source={{ uri: item.product?.imageUrl || 'https://via.placeholder.com/100' }}
                                            style={styles.miniImg}
                                        />
                                        {index === 4 && order.items.length > 5 && (
                                            <View style={styles.moreOverlay}>
                                                <Text style={styles.moreText}>+{order.items.length - 5}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.detailLink}
                                onPress={() => router.push(`/(franchise-staff)/orders/${order.id}`)}
                            >
                                <Text style={styles.detailLinkText}>Chi tiết</Text>
                                <Ionicons name="chevron-forward" size={16} color="#92400E" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.statusBtn}
                    onPress={() => router.push('/(franchise-staff)/(tabs)/orders')}
                >
                    <Text style={styles.statusBtnText}>Kiểm tra trạng thái</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.shoppingBtn}
                    onPress={() => router.replace('/(franchise-staff)/orders/create')}
                >
                    <Text style={styles.shoppingBtnText}>Tiếp tục mua sắm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    center: { justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 24, alignItems: 'center' },
    successIconWrapper: { marginTop: 10, marginBottom: 20 },
    successIconCircle: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEF3C7',
        justifyContent: 'center', alignItems: 'center', position: 'relative'
    },
    checkBadge: {
        position: 'absolute', bottom: 6, right: 6,
        backgroundColor: '#D97706', width: 26, height: 26, borderRadius: 13,
        borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center'
    },
    title: { fontSize: 26, fontWeight: '800', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 15, color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    boldText: { fontWeight: '700', color: '#000' },
    noteBox: {
        backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, width: '100%',
        marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6'
    },
    noteText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    card: {
        width: '100%', backgroundColor: '#F9FAFB', borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: '#F3F4F6', ...SHADOWS.sm
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    storeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    storeIconContainer: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF',
        justifyContent: 'center', alignItems: 'center'
    },
    storeName: { fontWeight: '700', fontSize: 17, color: '#111827' },
    totalPrice: { fontWeight: '800', fontSize: 17, color: '#111827' },
    timeRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24, backgroundColor: '#FFF', padding: 14, borderRadius: 16,
    },
    timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { color: '#111827', fontSize: 14, fontWeight: '700' },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    avatarStack: { flexDirection: 'row', alignItems: 'center', height: 40, flex: 1 },
    miniAvatar: {
        position: 'absolute', width: 36, height: 36, borderRadius: 18,
        borderWidth: 2, borderColor: '#FFF', overflow: 'hidden', backgroundColor: '#E5E7EB'
    },
    miniImg: { width: '100%', height: '100%' },
    moreOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center'
    },
    moreText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    detailLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    detailLinkText: { fontSize: 14, fontWeight: '700', color: '#92400E' },
    bottomButtons: { paddingHorizontal: 24, paddingBottom: 10, gap: 8 },
    statusBtn: { backgroundColor: '#000', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    statusBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    shoppingBtn: { height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    shoppingBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});