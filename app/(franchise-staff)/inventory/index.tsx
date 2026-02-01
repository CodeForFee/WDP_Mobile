import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge, Header } from '@/components/common';

const categories = ['All', 'Food', 'Drinks', 'Supplies'];

const inventoryItems = [
  { id: '1', name: 'Chicken Wings', description: 'Fresh frozen', stock: 12, unit: 'lbs', status: 'Low', category: 'Food' },
  { id: '2', name: 'French Fries', description: 'Frozen cut', stock: 45, unit: 'lbs', status: 'Good', category: 'Food' },
  { id: '3', name: 'Chicken Breast', description: 'Boneless', stock: 8, unit: 'lbs', status: 'Low', category: 'Food' },
  { id: '4', name: 'Coca Cola', description: '500ml bottles', stock: 120, unit: 'units', status: 'Good', category: 'Drinks' },
  { id: '5', name: 'Cooking Oil', description: 'Vegetable oil', stock: 2, unit: 'gallons', status: 'Low', category: 'Supplies' },
  { id: '6', name: 'Napkins', description: 'Paper napkins', stock: 15, unit: 'packs', status: 'Good', category: 'Supplies' },
];

export default function StoreInventoryScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? inventoryItems
    : inventoryItems.filter(item => item.category === activeCategory);

  const lowStockCount = inventoryItems.filter(item => item.status === 'Low').length;
  const outOfStockCount = 3; // Mock

  return (
    <View style={styles.container}>


      {/* Stats */}
      <View style={[styles.statsContainer, styles.contentAfterHeader]}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>142</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: COLORS.warningLight }]}>
          <Text style={[styles.statNumber, { color: COLORS.warningDark }]}>{lowStockCount}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: COLORS.errorLight }]}>
          <Text style={[styles.statNumber, { color: COLORS.errorDark }]}>{outOfStockCount}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              activeCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <TouchableOpacity style={styles.alertBanner}>
          <Ionicons name="warning" size={20} color={COLORS.error} />
          <Text style={styles.alertText}>Low Stock Alert</Text>
          <Text style={styles.alertCount}>{lowStockCount} items need restocking</Text>
          <Text style={styles.alertLink}>View All</Text>
        </TouchableOpacity>
      )}

      {/* Inventory List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/(franchise-staff)/inventory/${item.id}`)}
            >
              <View style={styles.itemHeader}>
                <View style={[
                  styles.itemIcon,
                  item.status === 'Low' && { backgroundColor: COLORS.warningLight }
                ]}>
                  <Ionicons
                    name={item.status === 'Low' ? 'alert' : 'checkmark-circle'}
                    size={16}
                    color={item.status === 'Low' ? COLORS.warningDark : COLORS.success}
                  />
                </View>
                <StatusBadge
                  status={item.status}
                  type={item.status === 'Low' ? 'warning' : 'completed'}
                  size="sm"
                />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Stock:</Text>
                <Text style={[
                  styles.stockValue,
                  item.status === 'Low' && { color: COLORS.warning }
                ]}>
                  {item.stock} {item.unit}
                </Text>
              </View>
              <View style={styles.stockBar}>
                <View style={[
                  styles.stockBarFill,
                  {
                    width: `${Math.min(item.stock * 2, 100)}%`,
                    backgroundColor: item.status === 'Low' ? COLORS.warning : COLORS.success,
                  }
                ]} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Categories
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  categoryTextActive: {
    color: COLORS.textLight,
  },
  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  alertText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.error,
  },
  alertCount: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  alertLink: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  itemCard: {
    width: '47%',
    marginBottom: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  stockLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  stockValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.success,
  },
  stockBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
