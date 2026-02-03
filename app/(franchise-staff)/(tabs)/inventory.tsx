import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge } from '@/components/common';

const categories = ['All', 'Burgers', 'Drinks', 'Desserts'];

const inventoryItems = [
  {
    id: '1',
    name: 'Classic Burger',
    calories: '450 cal',
    stock: 23,
    maxStock: 25,
    price: 14,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description: 'Homemade beef cutlet with signature...',
    isFavorite: true,
    category: 'Burgers'
  },
  {
    id: '2',
    name: 'Meat Grill',
    calories: '450 cal',
    stock: 23,
    maxStock: 25,
    price: 14,
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description: 'Homemade beef cutlet with signature...',
    isFavorite: true,
    category: 'Burgers'
  },
  {
    id: '3',
    name: 'Pumpkin Soup',
    calories: '200 cal',
    stock: 8,
    maxStock: 20,
    price: 10,
    image: 'https://images.unsplash.com/photo-1547496502-ffa22d388271?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description: 'Creamy pumpkin soup with...',
    isFavorite: false,
    category: 'Deserts'
  },
];

export default function StoreInventoryScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? inventoryItems
    : inventoryItems.filter(item => item.category === activeCategory);

  return (
    <View style={styles.container}>
      {/* Header Info Bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>The menu is active for:</Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>6d : 23h : 50 m</Text>
        </View>
      </View>

      {/* Header Title & Settings */}
      {/* Note: The main header is provided by _layout, but we might want a sub-header or just rely on that. 
          The design shows "Inventory" and a gear icon. _layout provides title "Kho" (Inventory) and back button. 
          We can add the gear icon to the _layout headerRight or just place it here if we hid the header.
          Let's assume we use the layout header but maybe we want custom content.
       */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Item Button */}
        <TouchableOpacity style={styles.addItemCard}>
          <Ionicons name="add" size={24} color={COLORS.success} />
          <Text style={styles.addItemText}>Add Item</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/(franchise-staff)/inventory/${item.id}` as any)}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <TouchableOpacity style={styles.favButton}>
                  <Ionicons name={item.isFavorite ? "heart" : "heart-outline"} size={16} color={COLORS.error} />
                </TouchableOpacity>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>{item.stock}/{item.maxStock}</Text>
                </View>
              </View>

              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.calRow}>
                  <Ionicons name="flame" size={12} color={COLORS.error} />
                  <Text style={styles.calText}>{item.calories}</Text>
                </View>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>${item.price}</Text>
                  <View style={styles.pepperRow}>
                    <Ionicons name="nutrition" size={14} color='#CCC' />
                    <Ionicons name="leaf" size={14} color='#CCC' />
                    <Ionicons name="fish" size={14} color='#CCC' />
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Settings FAB (As per design showing gear icon at top right usually, but since we have nav, maybe floating?) 
          Actually design shows it in top right corner of white card area. 
          We'll skip for now as header has back button.
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: SPACING.base,
    padding: SPACING.md,
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary, // Darker in image
    fontWeight: '600',
  },
  timerBadge: {
    backgroundColor: COLORS.background, // Light gray bg for timer
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  timerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 100,
    paddingTop: SPACING.lg, // Added spacing from header
  },
  addItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.successLight, // Light green dashed
    borderStyle: 'dashed',
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundSecondary, // White or very light green
    marginBottom: SPACING.md,
  },
  addItemText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md, // This might not work in some RN versions with flexWrap, verify
  },
  itemCard: {
    width: '48%', // roughly half
    padding: 0,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#FFF',
    ...SHADOWS.sm,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: COLORS.backgroundTertiary,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  itemContent: {
    padding: SPACING.md,
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  calRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  calText: {
    fontSize: 12,
    color: COLORS.error, // Redish for calories? or Muted. Image uses Red flame + Gray text usually.
    fontWeight: '500',
  },
  itemDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 12,
    height: 32, // limit height
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  pepperRow: {
    flexDirection: 'row',
    gap: 4,
  },
});
