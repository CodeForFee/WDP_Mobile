import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge } from '@/components/common';

// Mock Data for Customer Orders
const mockOrders = [
  {
    id: '34621',
    createdAt: 'Wed, Aug 04/ 11:00 am - 11:15 am', // Date format from image
    items: [
      { name: 'Pumpkin soup', quantity: 2, price: 14, image: 'https://images.unsplash.com/photo-1547496502-ffa22d388271?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Apple Pie', quantity: 4, price: 8, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    totalValue: 60, // 28 + 32
    status: 'Cooking',
    statusStep: 1, // 0: New, 1: Cooking, 2: Ready, 3: Picked Up
  },
  {
    id: '34622',
    createdAt: 'Wed, Aug 04/ 11:20 am - 11:35 am',
    items: [
      { name: 'Classic Burger', quantity: 1, price: 14, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Meat Grill', quantity: 1, price: 14, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Fries', quantity: 1, price: 5, image: 'https://images.unsplash.com/photo-1573080496987-aeb7d53345c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    totalValue: 33,
    status: 'New Order',
    statusStep: 0,
  },
  {
    id: '34619',
    createdAt: '6 August, 1:11 pm',
    items: [
      { name: 'Chicken Wings', quantity: 2, price: 12, image: 'https://images.unsplash.com/photo-1527477396000-64ca9c00173d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    totalValue: 24,
    status: 'Ready',
    statusStep: 2,
  },
  {
    id: '34618',
    createdAt: '6 August, 1:00 pm',
    items: [
      { name: 'Chicken Wings', quantity: 2, price: 12, image: 'https://images.unsplash.com/photo-1527477396000-64ca9c00173d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    totalValue: 24,
    status: 'Picked Up',
    statusStep: 3,
  },
];

type FilterTab = 'Requests' | 'In Progress' | 'Ready' | 'History';

export default function CustomerOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Requests');

  // Mapping tabs to statuses for filtering
  const getOrdersForTab = (tab: FilterTab) => {
    switch (tab) {
      case 'Requests': return mockOrders.filter(o => o.status === 'New Order');
      case 'In Progress': return mockOrders.filter(o => o.status === 'Cooking');
      case 'Ready': return mockOrders.filter(o => o.status === 'Ready');
      case 'History': return mockOrders.filter(o => o.status === 'Picked Up' || o.status === 'Cancelled');
      default: return mockOrders;
    }
  };

  const filteredOrders = getOrdersForTab(activeTab);

  // Timeline removed from list view for cleaner UI


  const renderOrderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <Card
      style={styles.orderCard}
      onPress={() => router.push(`/(franchise-staff)/orders/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderNumber}>Order № {item.id}</Text>
          <Text style={styles.orderDate}>{item.createdAt}</Text>
        </View>
        {/* Actions removed for cleaner UI */}
        <StatusBadge status={item.status} size="sm" type={item.status === 'Cooking' ? 'inProgress' : 'new'} />
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image source={{ uri: orderItem.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemPrice}>x{orderItem.quantity}</Text>
            </View>
            <Text style={styles.itemTotalPrice}>${orderItem.price * orderItem.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Total Row */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${item.totalValue}</Text>
      </View>

      {/* Main Action Button based on status */}
      {item.status === 'New Order' && (
        <TouchableOpacity style={styles.mainActionButton}>
          <Ionicons name="restaurant" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.mainActionText}>Cooking</Text>
        </TouchableOpacity>
      )}
      {item.status === 'Cooking' && (
        <TouchableOpacity style={[styles.mainActionButton, { backgroundColor: COLORS.success }]}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.mainActionText}>Ready</Text>
        </TouchableOpacity>
      )}
      {item.status === 'Ready' && (
        <TouchableOpacity style={[styles.mainActionButton, { backgroundColor: COLORS.textPrimary }]}>
          <Ionicons name="gift" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.mainActionText}>Hand Over</Text>
        </TouchableOpacity>
      )}

    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Orders</Text>
        <TouchableOpacity>
          <Text style={styles.headerLink}>Go to Inventory</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: SPACING.base }}>
          {(['Requests', 'In Progress', 'Ready', 'History'] as FilterTab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  screenTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  headerLink: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tabsContainer: {
    marginBottom: SPACING.md,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: SPACING.sm,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 100,
  },
  orderCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  orderNumber: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chatButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
  },
  detailsButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
  },
  itemsList: {
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  itemTotalPrice: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  // Timeline
  timelineSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    // paddingHorizontal: SPACING.sm,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineStepWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  timelineStep: {
    alignItems: 'center',
    zIndex: 2,
    width: '100%',
  },
  stepIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
  },
  stepInactive: {
    backgroundColor: COLORS.border,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stepLabelInactive: {
    color: COLORS.textMuted,
  },
  stepLine: {
    position: 'absolute',
    top: 12, // Half of 24 icon height
    left: '50%',
    width: '100%', // reaches to next
    height: 2,
    zIndex: 1,
  },
  stepLineActive: {
    backgroundColor: COLORS.primaryLight,
  },
  stepLineInactive: {
    backgroundColor: COLORS.border,
  },
  // Buttons
  mainActionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md, // Larger padding
    borderRadius: RADIUS.lg, // Less rounded, more like a button bar
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    flexDirection: 'row',
  },
  mainActionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  // Total Row
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textMuted,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});