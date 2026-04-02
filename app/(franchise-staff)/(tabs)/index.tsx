import React from 'react';
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
import { useRouter, useNavigation } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrder';
import { useShipment } from '@/hooks/useShipment';
import { CatalogItem, OrderMyStore } from '@/type';
import { ShipmentStatus } from '@/enum';
import { PAGINATION_DEFAULT } from '@/constant';

export default function FranchiseDashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const { useMe } = useAuth();
  const { useCatalog, useMyStoreOrders } = useOrder();
  const { useMyStoreShipments } = useShipment();

  const { data: user } = useMe();
  const { data: catalog = [], isLoading: loadingCatalog, refetch: refetchCatalog } = useCatalog(PAGINATION_DEFAULT);
  const { data: orders = [], isLoading: loadingOrders, refetch: refetchOrders } = useMyStoreOrders(PAGINATION_DEFAULT);
  const { data: allShipments = [], isLoading: loadingShipments, refetch: refetchShipments } = useMyStoreShipments(PAGINATION_DEFAULT);

  const handleReload = () => {
    refetchCatalog();
    refetchOrders();
    refetchShipments();
  };


  const shipments = allShipments.filter(
    (s) => s.status === ShipmentStatus.IN_TRANSIT
  );




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

  // ProductCatalogDto - theo api.md: id, name, sku, unit (imageUrl optional)
  const getCatalogImageUri = (item: CatalogItem): string | undefined =>
    item.imageUrl;

  // Render Catalog Item
  const renderCatalogItem = ({ item }: { item: CatalogItem }) => {
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
              <Text style={styles.welcomeText}>{user?.username || 'User'}</Text>
              <Text style={styles.roleText}>{user?.role || 'Staff'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton} onPress={handleReload}>
            <Ionicons name="refresh-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Orders Section - danh sách đơn hàng thật từ API */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('orders')}>
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

        {/* Incoming Shipments Section */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionTitle}>Hàng đang về</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('receiving')}>
            <Text style={styles.linkText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {loadingShipments ? (
          <View style={styles.ordersLoading}>
            <LoadingSpinner size={20} color={COLORS.primary} />
            <Text style={styles.ordersLoadingText}>Đang tải...</Text>
          </View>
        ) : shipments.length === 0 ? (
          <View style={styles.ordersEmpty}>
            <Ionicons name="cube-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.ordersEmptyText}>Không có hàng đang về</Text>
          </View>
        ) : (
          <FlatList
            horizontal
            data={shipments}
            renderItem={({ item }) => (
              <Card style={styles.shipmentCard} onPress={() => (navigation as any).navigate('receiving')}>
                <View style={styles.shipmentHeader}>
                  <View style={styles.shipmentIconWrap}>
                    <Ionicons name="airplane" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.shipmentInfo}>
                    <Text style={styles.shipmentId}>Mã: {item.id.slice(0, 8)}...</Text>
                    <Text style={styles.shipmentStatus}>Đang vận chuyển</Text>
                  </View>
                </View>
                <View style={styles.shipmentOrder}>
                  <Text style={styles.shipmentOrderLabel}>Đơn hàng:</Text>
                  <Text style={styles.shipmentOrderId}>{item.order?.storeName || item.orderId.slice(0, 8)}...</Text>
                </View>
              </Card>
            )}
            keyExtractor={item => item.id}
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
  // Shipment styles
  shipmentCard: { width: 200, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: '#FFF' },
  shipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  shipmentIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  shipmentInfo: { flex: 1 },
  shipmentId: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  shipmentStatus: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  shipmentOrder: { flexDirection: 'row', marginTop: SPACING.sm, gap: 4 },
  shipmentOrderLabel: { fontSize: 12, color: COLORS.textMuted },
  shipmentOrderId: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
});