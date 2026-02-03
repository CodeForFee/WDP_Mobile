import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useOrder } from '@/hooks/useOrder';

export default function OrderSuccessScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (id) fetchOrderDetails(String(id));
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const data = await useOrder.getOrderById(orderId);
            setOrder(data);
        } catch (error) { console.log(error); }
    };

    /**
     * LUỒNG ĐIỀU HƯỚNG VỀ HOME (TAB INVENTORY)
     * Sử dụng replace để đảm bảo Stack được reset sạch sẽ
     */
    const handleGoHome = () => {
        // Về trang chủ (Dashboard)
        router.dismissAll();
        router.replace('/(franchise-staff)/(tabs)');
    };

    const handleViewStatus = () => {
        router.replace('/(franchise-staff)/(tabs)/orders');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Icon Success - Không viền khung bọc ngoài */}
                <View style={styles.iconCircle}>
                    <Ionicons name="cart-outline" size={38} color="#333" />
                    <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                </View>

                <Text style={styles.title}>Order placed</Text>
                <Text style={styles.subtitle}>Đơn hàng của bạn đã được gửi thành công!</Text>

                {order && (
                    <View style={styles.card}>
                        <View style={styles.storeRow}>
                            <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.storeName}>{order.store?.name || 'My Store'}</Text>
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.itemStack}>
                                {order.items?.slice(0, 5).map((item: any, i: number) => (
                                    <View key={i} style={[styles.miniAvatar, { left: i * 22, zIndex: 10 - i }]}>
                                        <Image source={{ uri: item.product?.imageUrl }} style={styles.fullImg} />
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity onPress={() => router.push(`/(franchise-staff)/orders/${order.id}`)}>
                                <Text style={styles.detailLinkText}>Chi tiết</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.btnBlack} onPress={handleViewStatus}>
                    <Text style={styles.btnTextWhite}>Kiểm tra trạng thái</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnOutline} onPress={handleGoHome}>
                    <Text style={styles.btnTextBlack}>Tiếp tục mua sắm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    scrollContent: { padding: 24, alignItems: 'center' },
    iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
    checkBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: '#D97706', width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '800', marginTop: 20, color: '#111' },
    subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginTop: 10 },
    card: { width: '100%', backgroundColor: '#FAFAFA', borderRadius: 24, padding: 20, marginTop: 30, borderWidth: 1, borderColor: '#F0F0F0' },
    storeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    storeName: { fontWeight: '700', fontSize: 16, color: '#111' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemStack: { flexDirection: 'row', height: 40, flex: 1 },
    miniAvatar: { position: 'absolute', width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#FFF', backgroundColor: '#EEE', overflow: 'hidden' },
    fullImg: { width: '100%', height: '100%' },
    detailLinkText: { color: '#92400E', fontWeight: '700' },
    footerButtons: { padding: 24, gap: 12 },
    btnBlack: { backgroundColor: '#1A1A1A', height: 58, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    btnTextWhite: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    btnOutline: { height: 58, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    btnTextBlack: { color: '#333', fontWeight: '700', fontSize: 16 },
});