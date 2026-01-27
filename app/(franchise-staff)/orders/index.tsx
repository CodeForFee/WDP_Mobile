import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Card, StatusBadge, Header, Button } from '../../../src/components/common';

// Mock data for supply orders from Central Kitchen
const mockSupplyOrders = [
  {
    id: 'SO-2024-001',
    createdAt: '28/01/2024 09:30',
    requestedDelivery: '29/01/2024',
    items: [
      { name: 'Thịt gà tươi', quantity: 10, unit: 'kg' },
      { name: 'Cánh gà ướp sẵn', quantity: 5, unit: 'kg' },
      { name: 'Bột chiên giòn', quantity: 3, unit: 'kg' },
    ],
    totalItems: 3,
    totalValue: 1250000,
    status: 'Đang giao',
    statusType: 'processing',
    driver: 'Nguyễn Văn A',
    vehicle: '29C-123.45',
    estimatedArrival: '14:30',
  },
  {
    id: 'SO-2024-002',
    createdAt: '27/01/2024 14:15',
    requestedDelivery: '28/01/2024',
    items: [
      { name: 'Coca Cola', quantity: 5, unit: 'thùng' },
      { name: 'Hộp đựng thức ăn', quantity: 3, unit: 'gói' },
    ],
    totalItems: 2,
    totalValue: 1260000,
    status: 'Đã nhận',
    statusType: 'completed',
    receivedAt: '28/01/2024 10:00',
    receivedBy: 'Trần Thị B',
  },
  {
    id: 'SO-2024-003',
    createdAt: '28/01/2024 08:00',
    requestedDelivery: '29/01/2024',
    items: [
      { name: 'Khoai tây cắt sẵn', quantity: 20, unit: 'kg' },
      { name: 'Nước sốt cay', quantity: 5, unit: 'lít' },
      { name: 'Gà rán đông lạnh', quantity: 15, unit: 'kg' },
    ],
    totalItems: 3,
    totalValue: 3275000,
    status: 'Đang xử lý',
    statusType: 'pending',
  },
  {
    id: 'SO-2024-004',
    createdAt: '26/01/2024 16:00',
    requestedDelivery: '27/01/2024',
    items: [
      { name: 'Thịt gà tươi', quantity: 8, unit: 'kg' },
    ],
    totalItems: 1,
    totalValue: 680000,
    status: 'Đã nhận',
    statusType: 'completed',
    receivedAt: '27/01/2024 09:30',
    receivedBy: 'Lê Văn C',
  },
  {
    id: 'SO-2024-005',
    createdAt: '25/01/2024 11:00',
    requestedDelivery: '26/01/2024',
    items: [
      { name: 'Bột chiên giòn', quantity: 5, unit: 'kg' },
    ],
    totalItems: 1,
    totalValue: 225000,
    status: 'Đã hủy',
    statusType: 'cancelled',
    cancelReason: 'Hết hàng tại bếp trung tâm',
  },
];

type FilterTab = 'Tất cả' | 'Đang xử lý' | 'Đang giao' | 'Đã nhận' | 'Đã hủy';

export default function SupplyOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Tất cả');

  const tabs: FilterTab[] = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Đã nhận', 'Đã hủy'];

  const filteredOrders = mockSupplyOrders.filter(order => {
    if (activeTab === 'Tất cả') return true;
    return order.status === activeTab;
  });

  const getStatusBadgeType = (statusType: string): 'completed' | 'inProgress' | 'pending' | 'cancelled' => {
    switch (statusType) {
      case 'completed': return 'completed';
      case 'processing': return 'inProgress';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Stats
  const pendingCount = mockSupplyOrders.filter(o => o.status === 'Đang xử lý').length;
  const inTransitCount = mockSupplyOrders.filter(o => o.status === 'Đang giao').length;
  const completedCount = mockSupplyOrders.filter(o => o.status === 'Đã nhận').length;

  const renderOrderItem = ({ item }: { item: typeof mockSupplyOrders[0] }) => (
    <Card
      style={styles.orderCard}
      onPress={() => router.push(`/(franchise-staff)/orders/${item.id}` as any)}
    >
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{item.id}</Text>
          <StatusBadge
            status={item.status}
            type={getStatusBadgeType(item.statusType)}
            size="sm"
          />
        </View>
        <Text style={styles.orderDate}>{item.createdAt}</Text>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Ionicons name="cube-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.itemText}>
              {orderItem.name} x {orderItem.quantity} {orderItem.unit}
            </Text>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>+{item.items.length - 2} sản phẩm khác</Text>
        )}
      </View>

      <View style={styles.orderDivider} />

      {/* Status-specific info */}
      {item.status === 'Đang giao' && (
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryRow}>
            <Ionicons name="car" size={16} color={COLORS.primary} />
            <Text style={styles.deliveryText}>
              {item.driver} • {item.vehicle}
            </Text>
          </View>
          <View style={styles.deliveryRow}>
            <Ionicons name="time" size={16} color={COLORS.success} />
            <Text style={[styles.deliveryText, { color: COLORS.success }]}>
              Dự kiến: {item.estimatedArrival}
            </Text>
          </View>
        </View>
      )}

      {item.status === 'Đã nhận' && (
        <View style={styles.receivedInfo}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.receivedText}>
            Đã nhận lúc {item.receivedAt} bởi {item.receivedBy}
          </Text>
        </View>
      )}

      {item.status === 'Đã hủy' && (
        <View style={styles.cancelledInfo}>
          <Ionicons name="close-circle" size={16} color={COLORS.error} />
          <Text style={styles.cancelledText}>{item.cancelReason}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.deliveryLabel}>Ngày giao yêu cầu</Text>
          <Text style={styles.deliveryDate}>{item.requestedDelivery}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng giá trị</Text>
          <Text style={styles.totalValue}>{formatPrice(item.totalValue)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {item.status === 'Đang giao' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={16} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Gọi tài xế</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => router.push('/(franchise-staff)/receiving')}
          >
            <Ionicons name="checkmark" size={16} color={COLORS.textLight} />
            <Text style={[styles.actionButtonText, { color: COLORS.textLight }]}>Xác nhận nhận hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* <Header
        title="Đơn đặt hàng"
        subtitle="Theo dõi đơn từ Bếp trung tâm"
        rightElement={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(franchise-staff)/orders/create')}
          >
            <Ionicons name="add" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        }
      /> */}

      {/* Stats Summary */}
      <View style={[styles.statsRow, styles.contentAfterHeader]}>
        <View style={[styles.statItem, { backgroundColor: COLORS.warningLight }]}>
          <Text style={[styles.statValue, { color: COLORS.warningDark }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Đang xử lý</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{inTransitCount}</Text>
          <Text style={styles.statLabel}>Đang giao</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: COLORS.successLight }]}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Đã nhận</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(franchise-staff)/orders/create')}
      >
        <Ionicons name="add" size={28} color={COLORS.textLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Content spacing after header
  contentAfterHeader: {
    paddingTop: SPACING.md,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Tabs
  tabsScroll: {
    flexGrow: 0,
    marginBottom: SPACING.sm,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    alignItems: 'center', // Align items vertically in the row
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundSecondary,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  tabTextActive: {
    color: COLORS.textLight,
  },
  // List
  listContent: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  // Order Card
  orderCard: {
    marginBottom: SPACING.md,
  },
  orderHeader: {
    marginBottom: SPACING.sm,
  },
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  // Items Preview
  itemsPreview: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  itemText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  moreItems: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  // Delivery Info
  deliveryInfo: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  // Received Info
  receivedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  receivedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.successDark,
  },
  // Cancelled Info
  cancelledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  cancelledText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.errorDark,
  },
  // Footer
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deliveryLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  deliveryDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.base,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
