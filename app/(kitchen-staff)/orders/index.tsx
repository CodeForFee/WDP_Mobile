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

const mockOrders = [
  {
    id: '#ORD-2847',
    time: '3x Spicy Wings, 2x Family Bucket',
    priority: 'Priority',
    eta: '20 mins',
    status: 'Pending',
  },
  {
    id: '#ORD-2846',
    time: 'Crispy Chicken Burger, Family Bucket, Ginger Wings, Coleslaw',
    priority: 'Normal',
    eta: '15 mins',
    status: 'In Progress',
  },
  {
    id: '#ORD-2845',
    time: "Hit 'n Spicy Blast, Chicken Popcorn",
    priority: 'Normal',
    eta: '—',
    status: 'Complete',
  },
];

type FilterTab = 'All Orders' | 'Pending' | 'In Progress' | 'Complete';

export default function KitchenOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('All Orders');

  const tabs: FilterTab[] = ['All Orders', 'Pending', 'In Progress', 'Complete'];

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'All Orders') return true;
    return order.status === activeTab;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Central Kitchen"
      // subtitle="Incoming Orders"
      // rightElement={
      //   <TouchableOpacity>
      //     <Ionicons name="notifications" size={24} color={COLORS.textPrimary} />
      //   </TouchableOpacity>
      // }
      />

      {/* Stats Row */}
      <View style={[styles.statsRow, styles.contentAfterHeader]}>
        <View style={[styles.statBadge, { backgroundColor: COLORS.errorLight }]}>
          <Text style={[styles.statBadgeValue, { color: COLORS.error }]}>24</Text>
          <Text style={styles.statBadgeLabel}>Active</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: COLORS.warningLight }]}>
          <Text style={[styles.statBadgeValue, { color: COLORS.warningDark }]}>8</Text>
          <Text style={styles.statBadgeLabel}>Pending</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: COLORS.successLight }]}>
          <Text style={[styles.statBadgeValue, { color: COLORS.success }]}>12</Text>
          <Text style={styles.statBadgeLabel}>Delayed</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
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

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <Card
            style={styles.orderCard}
            onPress={() => router.push(`/(kitchen-staff)/orders/${item.id}`)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdRow}>
                {item.priority === 'Priority' && (
                  <View style={styles.priorityBadge}>
                    <Ionicons name="flame" size={12} color={COLORS.error} />
                    <Text style={styles.priorityText}>PRIORITY</Text>
                  </View>
                )}
                <Text style={styles.orderId}>{item.id}</Text>
              </View>
              <StatusBadge
                status={item.status}
                size="sm"
              />
            </View>

            <Text style={styles.orderItems} numberOfLines={2}>{item.time}</Text>

            <View style={styles.orderFooter}>
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.etaText}>{item.eta}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>View Details</Text>
                </TouchableOpacity>
                {item.status !== 'Complete' && (
                  <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
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
  statBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  statBadgeValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  statBadgeLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Tabs
  tabsScroll: {
    maxHeight: 48,
  },
  tabsContent: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  priorityText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  orderItems: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  etaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  detailButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  startButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
