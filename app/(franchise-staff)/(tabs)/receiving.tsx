import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge, Button, LoadingSpinner } from '@/components/common';
import { useShipment } from '@/hooks/useShipment';
import { Shipment, ShipmentDetail, ShipmentItem } from '@/type';
import { handleErrorApi } from '@/lib/errors';

export default function ReceiveGoodsScreen() {
  const router = useRouter();
  const shipmentApi = useShipment;

  // States
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch danh sách shipments
  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getMyStoreShipments({ sortOrder: 'DESC' });
      const data = (res as any)?.items || res;
      // Lọc chỉ lấy đơn đang chuẩn bị và đang vận chuyển
      const filtered = Array.isArray(data)
        ? data.filter((s: any) => s.status === 'preparing' || s.status === 'in_transit')
        : [];
      setShipments(filtered);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shipmentApi]);

  // Fetch chi tiết shipment
  const fetchShipmentDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await shipmentApi.getShipmentById(id);
      setSelectedShipment(res as ShipmentDetail);
    } catch (error) {
      handleErrorApi({ error });
      Alert.alert('Lỗi', 'Không thể lấy chi tiết shipment');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Load khi mount
  useFocusEffect(
    useCallback(() => {
      fetchShipments();
    }, [fetchShipments])
  );

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchShipments();
  };

  // Nhận hàng đủ (receive-all)
  const handleReceiveAll = async () => {
    if (!selectedShipment) return;

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn đã nhận đủ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              setLoadingDetail(true);
              await shipmentApi.receiveAll(selectedShipment.id);
              Alert.alert('Thành công', 'Đã xác nhận nhận hàng');
              setSelectedShipment(null);
              fetchShipments();
            } catch (error) {
              handleErrorApi({ error });
            } finally {
              setLoadingDetail(false);
            }
          },
        },
      ]
    );
  };

  // Báo cáo vấn đề (receive with details)
  const handleReportIssue = async () => {
    if (!selectedShipment || !selectedShipment.items) return;

    // Tạo data mặc định: tất cả items nhận đủ, không có hư hỏng
    // User có thể customize sau
    const items = selectedShipment.items.map((item: ShipmentItem) => ({
      batchId: item.batchId,
      actualQty: item.quantity,
      damagedQty: 0,
      evidenceUrls: [],
    }));

    Alert.alert(
      'Báo cáo vấn đề',
      'Bạn có muốn báo cáo hàng thiếu/hỏng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              setLoadingDetail(true);
              await shipmentApi.receiveWithDetails(selectedShipment.id, {
                items,
                notes: 'Nhận hàng có sai lệch',
              });
              Alert.alert('Thành công', 'Đã gửi báo cáo');
              setSelectedShipment(null);
              fetchShipments();
            } catch (error) {
              handleErrorApi({ error });
            } finally {
              setLoadingDetail(false);
            }
          },
        },
      ]
    );
  };

  // Format ngày
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Render item trong danh sách
  const renderShipmentItem = ({ item }: { item: Shipment }) => {
    const isSelected = selectedShipment?.id === item.id;

    return (
      <Card
        style={[styles.shipmentCard, isSelected && styles.shipmentCardSelected]}
        onPress={() => fetchShipmentDetail(item.id)}
      >
        <View style={styles.shipmentHeader}>
          <View style={styles.shipmentIconWrap}>
            <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.shipmentInfo}>
            <Text style={styles.shipmentId}>Mã: {item.id.slice(0, 8)}...</Text>
            <StatusBadge
              status={item.status}
              type={item.status === 'in_transit' ? 'shipping' : item.status === 'delivered' ? 'delivered' : 'pending'}
              size="sm"
            />
          </View>
        </View>
        <View style={styles.shipmentMeta}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.shipmentDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </Card>
    );
  };

  // Nếu đang xem chi tiết
  if (selectedShipment) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        {/* Header quay lại */}
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedShipment(null)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Chi tiết lô hàng</Text>
        </View>

        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          {loadingDetail ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Thông tin shipment */}
              <Card style={styles.detailCard}>
                <Text style={styles.detailSectionTitle}>Thông tin lô hàng</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã shipment</Text>
                  <Text style={styles.infoValue}>{selectedShipment.id.slice(0, 12)}...</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã đơn hàng</Text>
                  <Text style={styles.infoValue}>{selectedShipment.orderId.slice(0, 12)}...</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Trạng thái</Text>
                  <StatusBadge status={selectedShipment.status} type="shipping" size="sm" />
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày tạo</Text>
                  <Text style={styles.infoValue}>{formatDate(selectedShipment.createdAt)}</Text>
                </View>
              </Card>

              {/* Danh sách sản phẩm */}
              <Text style={styles.sectionTitle}>Danh sách sản phẩm ({selectedShipment.items?.length || 0})</Text>
              {selectedShipment.items?.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                      <Text style={styles.itemBatch}>Lô: {item.batchCode}</Text>
                    </View>
                    <View style={styles.itemQty}>
                      <Text style={styles.itemQtyText}>{item.quantity}</Text>
                      <Text style={styles.itemUnit}>đơn vị</Text>
                    </View>
                  </View>
                  <View style={styles.itemExpiry}>
                    <Ionicons name="calendar-outline" size={12} color="#E67E22" />
                    <Text style={styles.itemExpiryText}>HSD: {formatDate(item.expiryDate)}</Text>
                  </View>
                </Card>
              ))}

              {/* Nút hành động */}
              <View style={styles.actionsRow}>
                <Button
                  title="Báo cáo vấn đề"
                  variant="outline"
                  onPress={handleReportIssue}
                  style={styles.actionButton}
                  icon="warning-outline"
                />
                <Button
                  title="Nhận hàng đủ"
                  onPress={handleReceiveAll}
                  style={styles.actionButton}
                  icon="checkmark-circle-outline"
                />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Danh sách shipments
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhận hàng</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
        </View>
      ) : shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Không có lô hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={shipments}
          renderItem={renderShipmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.base, paddingTop: SPACING.md, backgroundColor: '#FFF' },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  emptyText: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.md },
  listContent: { padding: SPACING.base, paddingBottom: 100 },

  // Shipment card
  shipmentCard: { marginBottom: SPACING.md, padding: SPACING.md },
  shipmentCardSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  shipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  shipmentIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  shipmentInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shipmentId: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  shipmentMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  shipmentDate: { fontSize: 12, color: COLORS.textMuted },

  // Detail view
  detailHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, paddingTop: SPACING.md, backgroundColor: '#FFF', gap: SPACING.md },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  detailTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: 'bold' },
  detailScroll: { flex: 1 },
  detailContent: { padding: SPACING.base, paddingBottom: 120 },
  detailCard: { marginBottom: SPACING.lg, padding: SPACING.md },
  detailSectionTitle: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold', marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.sm },
  infoValue: { fontWeight: '600', fontSize: TYPOGRAPHY.fontSize.sm },

  // Item
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold', marginBottom: SPACING.md, marginTop: SPACING.md },
  itemCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  itemSku: { fontSize: 12, color: COLORS.textMuted },
  itemBatch: { fontSize: 12, color: COLORS.textMuted },
  itemQty: { alignItems: 'flex-end' },
  itemQtyText: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: 'bold', color: COLORS.primary },
  itemUnit: { fontSize: 12, color: COLORS.textMuted },
  itemExpiry: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  itemExpiryText: { fontSize: 12, color: '#E67E22', fontWeight: '600' },

  // Actions
  actionsRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  actionButton: { flex: 1 },
});