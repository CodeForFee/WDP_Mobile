import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';
import { Card, StatusBadge, Button, LoadingSpinner, getStatusType } from '@/components/common';
import { useShipment } from '@/hooks/useShipment';
import { PAGINATION_DEFAULT } from '@/constant';
import { handleErrorApi } from '@/lib/errors';
import { ShipmentStatus } from '@/enum';
import { Shipment, ShipmentDetail, ShipmentItem } from '@/type';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RECEIVABLE_STATUSES = [ShipmentStatus.PREPARING, ShipmentStatus.IN_TRANSIT];

export default function ReceiveGoodsScreen() {
  const router = useRouter();
  const { useMyStoreShipments, useShipmentDetail, receiveAllMutation } = useShipment();
  const { data: allShipments = [], isLoading, refetch } = useMyStoreShipments(PAGINATION_DEFAULT);

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data: shipmentDetail, isLoading: loadingDetail } = useShipmentDetail(selectedShipmentId ?? '');

  const shipments = allShipments.filter((s) => RECEIVABLE_STATUSES.includes(s.status));
  const currentShipment = shipments.find(
    (s) => s.status === ShipmentStatus.IN_TRANSIT || s.status === ShipmentStatus.DELIVERED
  ) ?? shipments[0];

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleAcceptDelivery = () => {
    if (!currentShipment) return;
    Alert.alert(
      'Xác nhận nhận hàng',
      'Bạn xác nhận đã kiểm tra và nhận đầy đủ số lượng hàng hóa trong shipment này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            receiveAllMutation.mutate(currentShipment.id, {
              onSuccess: () => {
                Alert.alert('Thành công', 'Đã nhận hàng thành công.');
                refetch();
              },
              onError: (error) => {
                handleErrorApi({ error });
              },
            });
          },
        },
      ]
    );
  };

  const handleReceiveAll = () => {
    if (!shipmentDetail) return;
    Alert.alert('Xác nhận', 'Bạn có chắc chắn đã nhận đủ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        onPress: () => {
          receiveAllMutation.mutate(shipmentDetail.id, {
            onSuccess: () => {
              Alert.alert('Thành công', 'Đã xác nhận nhận hàng');
              setSelectedShipmentId(null);
              refetch();
            },
            onError: (error) => {
              handleErrorApi({ error });
            },
          });
        },
      },
    ]);
  };

  const handleReportIssue = () => {
    const id = shipmentDetail?.id || currentShipment?.id;
    if (id) {
      router.push(`/(franchise-staff)/claims/report/${id}` as any);
    }
  };

  const renderShipmentItem = ({ item }: { item: Shipment }) => {
    const isSelected = selectedShipmentId === item.id;
    return (
      <Card
        style={[styles.shipmentCard, isSelected && styles.shipmentCardSelected]}
        onPress={() => setSelectedShipmentId(item.id)}
      >
        <View style={styles.shipmentHeader}>
          <View style={styles.shipmentIconWrap}>
            <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.shipmentInfo}>
            <Text style={styles.shipmentId}>Mã: {item.id.slice(0, 8)}...</Text>
            <StatusBadge
              status={item.status}
              type={
                item.status === ShipmentStatus.IN_TRANSIT
                  ? 'shipping'
                  : item.status === ShipmentStatus.DELIVERED
                    ? 'delivered'
                    : 'pending'
              }
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} color={COLORS.primary} />
      </View>
    );
  }

  if (receiveAllMutation.isPending && !selectedShipmentId) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      </View>
    );
  }

  if (selectedShipmentId && shipmentDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedShipmentId(null)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Chi tiết lô hàng</Text>
        </View>

        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          {loadingDetail ? (
            <LoadingSpinner />
          ) : (
            <>
              <Card style={styles.detailCard}>
                <Text style={styles.detailSectionTitle}>Thông tin lô hàng</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã shipment</Text>
                  <Text style={styles.infoValue}>{shipmentDetail.id.slice(0, 12)}...</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã đơn hàng</Text>
                  <Text style={styles.infoValue}>{shipmentDetail.orderId.slice(0, 12)}...</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Trạng thái</Text>
                  <StatusBadge status={shipmentDetail.status} type="shipping" size="sm" />
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày tạo</Text>
                  <Text style={styles.infoValue}>{formatDate(shipmentDetail.createdAt)}</Text>
                </View>
              </Card>

              <Text style={styles.sectionTitle}>
                Danh sách sản phẩm ({shipmentDetail.items?.length || 0})
              </Text>
              {(shipmentDetail.items ?? []).map((item: ShipmentItem, index: number) => (
                <Card key={`${item.batchId}-${index}`} style={styles.itemCard}>
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
                  loading={receiveAllMutation.isPending}
                />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhận hàng</Text>
      </View>

      {shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Không có lô hàng cần nhận</Text>
        </View>
      ) : (
        <View style={styles.mainContent}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, styles.listTitle]}>Danh sách lô hàng</Text>
            <FlatList
              data={shipments}
              renderItem={renderShipmentItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={COLORS.primary}
                />
              }
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.base, paddingTop: SPACING.md, backgroundColor: '#FFF' },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: COLORS.textMuted },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  emptyText: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.md },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.md },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  listTitle: { paddingHorizontal: SPACING.base, marginTop: 0 },
  listContent: { padding: SPACING.base, paddingBottom: 120 },

  shipmentCard: { marginBottom: SPACING.md, padding: SPACING.md },
  shipmentCardSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  shipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  shipmentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipmentInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentId: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  shipmentMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  shipmentDate: { fontSize: 12, color: COLORS.textMuted },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    paddingTop: SPACING.md,
    backgroundColor: '#FFF',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: 'bold' },
  detailScroll: { flex: 1 },
  detailContent: { padding: SPACING.base, paddingBottom: 120 },
  detailCard: { marginBottom: SPACING.lg, padding: SPACING.md },
  detailSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.sm },
  infoValue: { fontWeight: '600', fontSize: TYPOGRAPHY.fontSize.sm },

  itemCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  itemSku: { fontSize: 12, color: COLORS.textMuted },
  itemBatch: { fontSize: 12, color: COLORS.textMuted },
  itemQty: { alignItems: 'flex-end' },
  itemQtyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemUnit: { fontSize: 12, color: COLORS.textMuted },
  itemExpiry: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  itemExpiryText: { fontSize: 12, color: '#E67E22', fontWeight: '600' },

  actionsRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  actionButton: { flex: 1 },
  footerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.base,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
