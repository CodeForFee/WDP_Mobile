import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Card, StatusBadge, LoadingSpinner, getStatusType } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useSessionStore } from '@/stores/storeSession';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrder';
import { User, Catelog, OrderMyStore } from '@/type';
import { handleErrorApi } from '@/lib/errors';

export default function FranchiseDashboard() {
  const router = useRouter();
  const session = useSessionStore();
  const [user, setUser] = useState<User | null>(null);
  const [catalog, setCatalog] = useState<Catelog[]>([]);
  const [orders, setOrders] = useState<OrderMyStore[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchCatalog();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await useOrder.getMyStoreOrders();
      setOrders(data);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await useAuth.me();
      setUser(userData);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const data = await useOrder.getCatalog();
      setCatalog(data);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingCatalog(false);
    }
  };

  const displayName = user?.username || session.user?.email || 'User';
  const displayRole = user?.role || session.user?.role || 'Staff';

  const formatOrderTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${weekday}: ${time}`;
  };

  const renderOrderItem = ({ item }: { item: OrderMyStore }) => {
    const timeLabel = item.deliveryDate ? formatOrderTime(item.deliveryDate) : formatOrderTime(item.createdAt);
    const itemThumbnails = (item.items || []).slice(0, 3).map((orderItem) => orderItem?.product?.imageUrl || (orderItem?.product as any)?.image_url);
    return (
      <Card
        style={styles.orderCard}
        onPress={() => router.push(`/(franchise-staff)/orders/${item.id}` as any)}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>№ {item.id.slice(0, 8)}...</Text>
            <Text style={styles.orderTime}>{timeLabel}</Text>
          </View>
          <StatusBadge status={item.status} type={getStatusType(item.status)} size="sm" />
        </View>
        <View style={styles.orderItemsRow}>
          {itemThumbnails.length > 0 ? (
            itemThumbnails.map((uri, index) => (
              <View key={index} style={styles.miniItem}>
                {uri ? (
                  <Image source={{ uri }} style={styles.miniItemImage} resizeMode="cover" />
                ) : (
                  <Ionicons name="cube-outline" size={24} color={COLORS.textMuted} style={styles.miniItemIcon} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.miniItem}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.textMuted} style={styles.miniItemIcon} />
            </View>
          )}
        </View>
      </Card>
    );
  };

  // Lấy ảnh sản phẩm: catalog có thể trả image_url, imageUrl, thumbnail, photo (backend cần gửi ít nhất 1)
  const getCatalogImageUri = (item: Catelog): string | undefined =>
    item.image_url || item.imageUrl || item.thumbnail || (item as any).photo;

  // Render Catalog Item
  const renderCatalogItem = ({ item }: { item: Catelog }) => {
    const imageUri = getCatalogImageUri(item);

    return (
      <Card style={styles.catalogCard} onPress={() => router.push('/(franchise-staff)/orders/create' as any)}>
        <View style={styles.catalogIconWrap}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.catalogImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="cube-outline" size={40} color={COLORS.textMuted} />
          )}
        </View>
        <View style={styles.catalogDetails}>
          <Text style={styles.catalogName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.skuTag}>
            <Text style={styles.catalogSku}>SKU: {item.sku}</Text>
          </View>
          <Text style={styles.catalogUnit}>{item.unit}</Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header (Giữ nguyên) */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.welcomeText}>{displayName}</Text>
              <Text style={styles.roleText}>{displayRole}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications" size={20} color={COLORS.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Orders Section - danh sách đơn hàng thật từ API */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng</Text>
          <TouchableOpacity onPress={() => router.push('/(franchise-staff)/(tabs)/orders' as any)}>
            <Text style={styles.linkText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {loadingOrders ? (
          <View style={styles.ordersLoading}>
            <LoadingSpinner size={20} color={COLORS.primary} />
            <Text style={styles.ordersLoadingText}>Đang tải đơn hàng...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.ordersEmpty}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.ordersEmptyText}>Chưa có đơn hàng</Text>
            <TouchableOpacity style={styles.ordersEmptyBtn} onPress={() => router.push('/(franchise-staff)/orders/create' as any)}>
              <Text style={styles.ordersEmptyBtnText}>Tạo đơn mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            horizontal
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}

        {/* Catalog Section */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionTitle}>Sản phẩm hệ thống</Text>
          <TouchableOpacity onPress={() => router.push('/(franchise-staff)/orders/create' as any)}>
            <Text style={styles.linkText}>Đặt hàng</Text>
          </TouchableOpacity>
        </View>

        {loadingCatalog ? (
          <LoadingSpinner size={20} color={COLORS.primary} />
        ) : (
          <FlatList
            horizontal
            data={catalog}
            renderItem={renderCatalogItem}
            keyExtractor={item => String(item.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.base, marginBottom: SPACING.xl },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  welcomeText: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: 'bold' },
  roleText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textMuted },
  notifButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
  notifDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, borderWidth: 1, borderColor: '#FFF' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.base, marginBottom: SPACING.md },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: 'bold' },
  linkText: { color: COLORS.primary, fontWeight: 'bold' },
  horizontalList: { paddingHorizontal: SPACING.base, gap: SPACING.md },
  orderCard: { width: 280, padding: SPACING.md, borderRadius: RADIUS.lg },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  orderId: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  orderTime: { fontSize: 12, color: COLORS.textMuted },
  orderItemsRow: { flexDirection: 'row', gap: SPACING.sm },
  miniItem: { width: 50, height: 50, borderRadius: RADIUS.md, overflow: 'hidden', backgroundColor: COLORS.backgroundTertiary, justifyContent: 'center', alignItems: 'center' },
  miniItemImage: { width: '100%', height: '100%' },
  miniItemIcon: {},
  ordersLoading: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.base },
  ordersLoadingText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textMuted },
  ordersEmpty: { alignItems: 'center', paddingVertical: SPACING.xl, paddingHorizontal: SPACING.base, gap: SPACING.sm },
  ordersEmptyText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textMuted },
  ordersEmptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.md },
  ordersEmptyBtnText: { color: COLORS.textLight, fontWeight: '600', fontSize: TYPOGRAPHY.fontSize.sm },
  catalogCard: { width: 150, padding: SPACING.sm, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: '#FFF' },
  catalogIconWrap: { width: 130, height: 90, borderRadius: RADIUS.md, backgroundColor: COLORS.backgroundTertiary, marginBottom: SPACING.sm, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  catalogImage: { width: '100%', height: '100%' },
  catalogDetails: { alignItems: 'center', width: '100%' },
  catalogName: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: 'bold', textAlign: 'center' },
  skuTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginVertical: 4 },
  catalogSku: { fontSize: 10, color: COLORS.textMuted },
  catalogUnit: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
});