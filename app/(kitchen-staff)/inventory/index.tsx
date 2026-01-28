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
import { Card, StatusBadge, Header } from '../../../src/components/common';

// Mock data with expiration dates and batch/lot tracking
const inventoryItems = [
  {
    id: '1',
    name: 'Thịt gà tươi',
    type: 'Gà nguyên con Grade A',
    quantity: 25,
    unit: 'kg',
    batches: [
      { lotId: 'LOT-2024-0128-A', quantity: 15, expiry: '2024-01-30', status: 'good' },
      { lotId: 'LOT-2024-0126-B', quantity: 10, expiry: '2024-01-29', status: 'warning' },
    ],
    nearestExpiry: '2024-01-29',
    daysUntilExpiry: 1,
    status: 'warning',
    category: 'Nguyên liệu',
  },
  {
    id: '2',
    name: 'Bột chiên giòn',
    type: 'Công thức đặc biệt',
    quantity: 50,
    unit: 'kg',
    batches: [
      { lotId: 'LOT-2024-0115-A', quantity: 50, expiry: '2024-03-15', status: 'good' },
    ],
    nearestExpiry: '2024-03-15',
    daysUntilExpiry: 46,
    status: 'good',
    category: 'Nguyên liệu',
  },
  {
    id: '3',
    name: 'Dầu ăn',
    type: 'Dầu hướng dương',
    quantity: 5,
    unit: 'lít',
    batches: [
      { lotId: 'LOT-2024-0120-A', quantity: 5, expiry: '2024-01-28', status: 'critical' },
    ],
    nearestExpiry: '2024-01-28',
    daysUntilExpiry: 0,
    status: 'critical',
    category: 'Nguyên liệu',
  },
  {
    id: '4',
    name: 'Cánh gà ướp sẵn',
    type: 'Bán thành phẩm đông lạnh',
    quantity: 80,
    unit: 'kg',
    batches: [
      { lotId: 'BCH-2024-0127-001', quantity: 40, expiry: '2024-02-10', status: 'good' },
      { lotId: 'BCH-2024-0125-002', quantity: 40, expiry: '2024-02-05', status: 'good' },
    ],
    nearestExpiry: '2024-02-05',
    daysUntilExpiry: 8,
    status: 'good',
    category: 'Bán thành phẩm',
  },
  {
    id: '5',
    name: 'Nước sốt cay',
    type: 'Sốt đặc biệt đóng chai',
    quantity: 30,
    unit: 'lít',
    batches: [
      { lotId: 'LOT-2024-0110-A', quantity: 20, expiry: '2024-02-28', status: 'good' },
      { lotId: 'LOT-2024-0105-B', quantity: 10, expiry: '2024-01-31', status: 'warning' },
    ],
    nearestExpiry: '2024-01-31',
    daysUntilExpiry: 3,
    status: 'warning',
    category: 'Bán thành phẩm',
  },
  {
    id: '6',
    name: 'Khoai tây cắt sẵn',
    type: 'Đông lạnh cắt sợi',
    quantity: 100,
    unit: 'kg',
    batches: [
      { lotId: 'LOT-2024-0120-A', quantity: 100, expiry: '2024-04-20', status: 'good' },
    ],
    nearestExpiry: '2024-04-20',
    daysUntilExpiry: 82,
    status: 'good',
    category: 'Bán thành phẩm',
  },
];

type FilterTab = 'Tất cả' | 'Sắp hết hạn' | 'Tồn kho thấp' | 'Nguyên liệu' | 'Bán thành phẩm';

export default function KitchenInventoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Tất cả');

  const tabs: FilterTab[] = ['Tất cả', 'Sắp hết hạn', 'Tồn kho thấp', 'Nguyên liệu', 'Bán thành phẩm'];

  const filteredItems = inventoryItems.filter(item => {
    switch (activeTab) {
      case 'Sắp hết hạn':
        return item.daysUntilExpiry <= 3;
      case 'Tồn kho thấp':
        return item.status === 'warning' || item.status === 'critical';
      case 'Nguyên liệu':
        return item.category === 'Nguyên liệu';
      case 'Bán thành phẩm':
        return item.category === 'Bán thành phẩm';
      default:
        return true;
    }
  });

  // Stats
  const criticalCount = inventoryItems.filter(i => i.status === 'critical').length;
  const warningCount = inventoryItems.filter(i => i.status === 'warning').length;
  const expiringCount = inventoryItems.filter(i => i.daysUntilExpiry <= 3).length;
  const totalItems = inventoryItems.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return COLORS.error;
      case 'warning': return COLORS.warningDark;
      default: return COLORS.success;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'critical': return COLORS.errorLight;
      case 'warning': return COLORS.warningLight;
      default: return COLORS.successLight;
    }
  };

  const formatExpiryText = (days: number) => {
    if (days < 0) return 'Đã hết hạn';
    if (days === 0) return 'Hết hạn hôm nay';
    if (days === 1) return 'Còn 1 ngày';
    return `Còn ${days} ngày`;
  };

  const renderInventoryItem = ({ item }: { item: typeof inventoryItems[0] }) => (
    <Card
      style={styles.itemCard}
      onPress={() => router.push(`/(kitchen-staff)/inventory/${item.id}`)}
    >
      {/* Header */}
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleRow}>
          <View style={[styles.itemIcon, { backgroundColor: getStatusBg(item.status) }]}>
            <Ionicons
              name={item.status === 'good' ? 'checkmark-circle' : 'warning'}
              size={20}
              color={getStatusColor(item.status)}
            />
          </View>
          <View style={styles.itemTitleInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemType}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.itemQuantityBox}>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Text style={styles.itemUnit}>{item.unit}</Text>
        </View>
      </View>

      {/* Expiry Alert */}
      <View style={[
        styles.expiryAlert,
        { backgroundColor: getStatusBg(item.status) }
      ]}>
        <Ionicons
          name="time"
          size={16}
          color={getStatusColor(item.status)}
        />
        <Text style={[styles.expiryText, { color: getStatusColor(item.status) }]}>
          {formatExpiryText(item.daysUntilExpiry)} • HSD gần nhất: {item.nearestExpiry}
        </Text>
      </View>

      {/* Batches Preview */}
      <View style={styles.batchesSection}>
        <Text style={styles.batchesTitle}>Lô hàng ({item.batches.length})</Text>
        {item.batches.slice(0, 2).map((batch, index) => (
          <View key={batch.lotId} style={styles.batchRow}>
            <View style={styles.batchInfo}>
              <View style={[
                styles.batchDot,
                { backgroundColor: getStatusColor(batch.status) }
              ]} />
              <Text style={styles.batchLotId}>{batch.lotId}</Text>
            </View>
            <Text style={styles.batchQuantity}>{batch.quantity} {item.unit}</Text>
            <Text style={[styles.batchExpiry, { color: getStatusColor(batch.status) }]}>
              {batch.expiry}
            </Text>
          </View>
        ))}
        {item.batches.length > 2 && (
          <Text style={styles.moreBatches}>+{item.batches.length - 2} lô khác</Text>
        )}
      </View>

      {/* Action */}
      <TouchableOpacity style={styles.viewDetailButton}>
        <Text style={styles.viewDetailText}>Xem chi tiết & Quản lý lô</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Quản lý Nguyên liệu"
        // subtitle="Bếp trung tâm"
        showBack
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </TouchableOpacity>
        }
      />

      {/* Stats Summary */}
      <View style={[styles.statsRow, styles.contentAfterHeader]}>
        <View style={[styles.statItem, { backgroundColor: COLORS.errorLight }]}>
          <Text style={[styles.statValue, { color: COLORS.error }]}>{criticalCount}</Text>
          <Text style={styles.statLabel}>Hết hạn</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: COLORS.warningLight }]}>
          <Text style={[styles.statValue, { color: COLORS.warningDark }]}>{warningCount}</Text>
          <Text style={styles.statLabel}>Sắp hết hạn</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{expiringCount}</Text>
          <Text style={styles.statLabel}>Cần xử lý</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: COLORS.successLight }]}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{totalItems}</Text>
          <Text style={styles.statLabel}>Tổng loại</Text>
        </View>
      </View>

      {/* Scan Barcode Card */}
      <View style={styles.scanSection}>
        <Card style={styles.scanCard}>
          <View style={styles.scanContent}>
            <View style={styles.scanIconBox}>
              <Ionicons name="barcode" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.scanTextContent}>
              <Text style={styles.scanTitle}>Quét mã vạch</Text>
              <Text style={styles.scanSubtext}>Nhập nguyên liệu vào kho</Text>
            </View>
            <TouchableOpacity style={styles.scanButton}>
              <Ionicons name="scan" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
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
              {tab === 'Sắp hết hạn' && expiringCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{expiringCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredItems}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Không có nguyên liệu nào</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
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
  // Content spacing after header
  contentAfterHeader: {
    paddingTop: SPACING.md,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  onlineText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
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
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Scan Section
  scanSection: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  scanCard: {
    marginBottom: 0,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanIconBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  scanTextContent: {
    flex: 1,
  },
  scanTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  scanSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  scanButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Filter Section
  filterSection: {
    marginBottom: SPACING.sm,
  },
  // Tabs
  tabsScroll: {
    // Removed maxHeight to prevent clipping
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    alignItems: 'center', // Center vertically to handle different heights
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl, // Wider horizontal padding
    paddingVertical: 14, // Increased vertical padding for larger touch target
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: SPACING.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 48, // Taller minimum height
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 4,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#333333', // Explicit dark gray
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000000', // Explicit black
    fontWeight: 'bold',
  },
  tabBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  // List
  listContent: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  // Item Card
  itemCard: {
    marginBottom: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  itemTitleInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  itemType: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  itemQuantityBox: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  itemUnit: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  // Expiry Alert
  expiryAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  expiryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Batches Section
  batchesSection: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  batchesTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  batchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  batchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  batchLotId: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  batchQuantity: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.md,
  },
  batchExpiry: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  moreBatches: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  // View Detail Button
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.xs,
  },
  viewDetailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
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
