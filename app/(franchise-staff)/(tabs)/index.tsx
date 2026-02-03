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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge } from '@/components/common';

// Mock Data for Dashboard
const activeOrders = [
  {
    id: '34621',
    time: '11:00 am - 11:15 am',
    items: [
      { name: 'Pumpkin soup', quantity: 2, price: 14, image: 'https://images.unsplash.com/photo-1547496502-ffa22d388271?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Apple Pie', quantity: 4, price: 8, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    status: 'Cooking',
  },
  {
    id: '34622',
    time: '11:20 am - 11:35 am',
    items: [
      { name: 'Beef Burger', quantity: 1, price: 14, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ],
    status: 'New Order',
  }
];

const inventoryItems = [
  { id: '1', name: 'Classic Burger', calories: '450 cal', stock: '23/25', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Meat Grill', calories: '500 cal', stock: '12/25', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Grilled Chicken', calories: '350 cal', stock: '18/20', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
];

export default function FranchiseDashboard() {
  const router = useRouter();

  const renderOrderItem = ({ item }: { item: typeof activeOrders[0] }) => (
    <Card style={styles.orderCard} onPress={() => router.push('/(franchise-staff)/orders')}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>№ {item.id}</Text>
          <Text style={styles.orderTime}>Mon {item.time}</Text>
        </View>
        <StatusBadge status={item.status} type={item.status === 'Cooking' ? 'inProgress' : 'new'} size="sm" />
      </View>

      <View style={styles.orderItemsRow}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.miniItem}>
            <Image source={{ uri: orderItem.image }} style={styles.miniItemImage} />
            {/* <Text style={styles.miniItemQty}>x{orderItem.quantity}</Text> */}
          </View>
        ))}
        {item.items.length > 3 && (
          <View style={[styles.miniItem, styles.moreItems]}>
            <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderInventoryItem = ({ item }: { item: typeof inventoryItems[0] }) => (
    <Card style={styles.inventoryCard} onPress={() => router.push(`/(franchise-staff)/inventory/${item.id}` as any)}>
      <View style={styles.inventoryImageContainer}>
        <Image source={{ uri: item.image }} style={styles.inventoryImage} />
        <View style={styles.heartButton}>
          <Ionicons name="heart" size={16} color={COLORS.error} />
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>{item.stock}</Text>
        </View>
      </View>
      <View style={styles.inventoryDetails}>
        <Text style={styles.inventoryName}>{item.name}</Text>
        <View style={styles.calRow}>
          <Ionicons name="flame" size={12} color={COLORS.error} />
          <Text style={styles.calText}>{item.calories}</Text>
        </View>
        <Text style={styles.inventoryDesc}>Homemade beef cutlet with signature...</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>$14</Text>
          <View style={styles.pepperRow}>
            <Ionicons name="nutrition" size={12} color={COLORS.error} />
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Custom Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Maria's Kitchen</Text>
              <Text style={styles.roleText}>Cookstro</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications" size={20} color={COLORS.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Orders</Text>
          <TouchableOpacity onPress={() => router.push('/(franchise-staff)/orders')}>
            <Text style={styles.linkText}>Go to Orders</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={activeOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Inventory Section */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          <TouchableOpacity onPress={() => router.push('/(franchise-staff)/inventory')}>
            <Text style={styles.linkText}>Go to Inventory</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={inventoryItems}
          renderItem={renderInventoryItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Menu Section (Placeholder) */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Go to Menu</Text>
          </TouchableOpacity>
        </View>
        {/* Add minimal menu placeholder or leave empty as per image suggestion it's just a section */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100, // For TabBar
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  roleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  linkText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary, // Lighter green as per design
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  horizontalList: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  // Order Card
  orderCard: {
    width: 280,
    padding: SPACING.md,
    marginRight: SPACING.sm, // Gap handled by contentContainer but Card needs margin for shadow to show if cropped? No, gap works.
    borderRadius: RADIUS.lg,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  orderTime: {
    fontSize: 12, // smaller
    color: COLORS.textMuted,
    marginTop: 2,
  },
  orderItemsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  miniItem: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundTertiary,
  },
  miniItemImage: {
    width: '100%',
    height: '100%',
  },
  moreItems: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
  },
  moreItemsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  // Inventory Card
  inventoryCard: {
    width: 180,
    padding: 0, // Image goes to edge
    marginRight: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  inventoryImageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: COLORS.backgroundTertiary,
  },
  inventoryImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  inventoryDetails: {
    padding: SPACING.md,
  },
  inventoryName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  calRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  calText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  inventoryDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  pepperRow: {
    flexDirection: 'row',
    gap: 2,
  },
});
