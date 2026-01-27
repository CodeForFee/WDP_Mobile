import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Card, Button, Header } from '../../../src/components/common';

// Categories for ingredients/semi-finished products from Central Kitchen
const categories = ['Tất cả', 'Nguyên liệu', 'Bán thành phẩm', 'Đồ uống', 'Đóng gói'];

// Mock products from Central Kitchen catalog
const centralKitchenProducts = [
  { id: '1', name: 'Thịt gà tươi', description: 'Gà nguyên con đã sơ chế', price: 85000, unit: 'kg', category: 'Nguyên liệu', minOrder: 5, available: 150 },
  { id: '2', name: 'Cánh gà ướp sẵn', description: 'Cánh gà tẩm ướp gia vị đặc biệt', price: 120000, unit: 'kg', category: 'Bán thành phẩm', minOrder: 3, available: 80 },
  { id: '3', name: 'Bột chiên giòn', description: 'Bột tẩm chiên công thức đặc biệt', price: 45000, unit: 'kg', category: 'Nguyên liệu', minOrder: 2, available: 200 },
  { id: '4', name: 'Khoai tây cắt sẵn', description: 'Khoai tây đông lạnh cắt sợi', price: 35000, unit: 'kg', category: 'Bán thành phẩm', minOrder: 5, available: 100 },
  { id: '5', name: 'Nước sốt cay', description: 'Sốt cay đặc biệt đóng chai', price: 65000, unit: 'lít', category: 'Bán thành phẩm', minOrder: 2, available: 50 },
  { id: '6', name: 'Coca Cola', description: 'Lon 330ml - Thùng 24 lon', price: 180000, unit: 'thùng', category: 'Đồ uống', minOrder: 1, available: 300 },
  { id: '7', name: 'Hộp đựng thức ăn', description: 'Hộp giấy size M - 100 cái/gói', price: 120000, unit: 'gói', category: 'Đóng gói', minOrder: 2, available: 500 },
  { id: '8', name: 'Gà rán đông lạnh', description: 'Gà rán sơ chế, chỉ cần chiên', price: 150000, unit: 'kg', category: 'Bán thành phẩm', minOrder: 5, available: 60 },
];

interface OrderItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  minOrder: number;
}

export default function CreateSupplyOrderScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState('');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('Ngày mai');

  const deliveryOptions = ['Hôm nay', 'Ngày mai', 'Trong 2 ngày', 'Trong 3 ngày'];

  const addToOrder = (product: typeof centralKitchenProducts[0]) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.minOrder }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: product.minOrder,
        minOrder: product.minOrder,
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setOrderItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty < item.minOrder) return null as any;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeItem = (productId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== productId));
  };

  const getItemQuantity = (productId: string) => {
    return orderItems.find(item => item.id === productId)?.quantity || 0;
  };

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = centralKitchenProducts
    .filter(p => activeCategory === 'Tất cả' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm');
      return;
    }
    Alert.alert(
      'Xác nhận đơn hàng',
      `Bạn có chắc muốn gửi đơn đặt hàng với ${orderItems.length} sản phẩm?\nTổng giá trị: ${formatPrice(totalPrice)}`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gửi đơn',
          onPress: () => {
            Alert.alert('Thành công', 'Đơn đặt hàng đã được gửi đến Bếp trung tâm!');
            router.back();
          }
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <View style={styles.container}>
      {/* <Header
        title="Đặt hàng từ Bếp TT"
        subtitle="Tạo đơn đặt nguyên liệu"
        showBack
        onBack={() => router.back()}
      /> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm nguyên liệu..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Delivery Date Selection */}
      <View style={styles.deliverySection}>
        <Text style={styles.deliveryLabel}>Ngày giao hàng mong muốn:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.deliveryOptions}>
            {deliveryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.deliveryOption,
                  selectedDeliveryDate === option && styles.deliveryOptionActive,
                ]}
                onPress={() => setSelectedDeliveryDate(option)}
              >
                <Text
                  style={[
                    styles.deliveryOptionText,
                    selectedDeliveryDate === option && styles.deliveryOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
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
      </ScrollView>

      {/* Products List */}
      <ScrollView
        style={styles.productsList}
        contentContainerStyle={styles.productsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.map((product) => {
          const quantity = getItemQuantity(product.id);
          const isInCart = quantity > 0;
          return (
            <Card key={product.id} style={[styles.productCard, isInCart && styles.productCardSelected]}>
              <View style={styles.productHeader}>
                <View style={styles.productIcon}>
                  <Ionicons
                    name={
                      product.category === 'Nguyên liệu' ? 'leaf' :
                        product.category === 'Bán thành phẩm' ? 'restaurant' :
                          product.category === 'Đồ uống' ? 'water' : 'cube'
                    }
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDesc} numberOfLines={1}>{product.description}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{formatPrice(product.price)}/{product.unit}</Text>
                    <Text style={styles.productStock}>Tồn: {product.available} {product.unit}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.minOrderText}>Đặt tối thiểu: {product.minOrder} {product.unit}</Text>
                <View style={styles.quantityControls}>
                  {isInCart ? (
                    <>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQuantity(product.id, -1)}
                      >
                        <Ionicons name="remove" size={18} color={COLORS.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{quantity}</Text>
                      <TouchableOpacity
                        style={[styles.qtyButton, styles.qtyButtonFilled]}
                        onPress={() => updateQuantity(product.id, 1)}
                      >
                        <Ionicons name="add" size={18} color={COLORS.textLight} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.addButton]}
                      onPress={() => addToOrder(product)}
                    >
                      <Ionicons name="add" size={16} color={COLORS.textLight} />
                      <Text style={styles.addButtonText}>Thêm</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <View style={styles.orderSummary}>
          <View style={styles.orderSummaryTop}>
            <View style={styles.orderSummaryInfo}>
              <Text style={styles.orderSummaryLabel}>Sản phẩm</Text>
              <Text style={styles.orderSummaryCount}>{orderItems.length} loại</Text>
            </View>
            <View style={styles.orderSummaryInfo}>
              <Text style={styles.orderSummaryLabel}>Tổng tiền</Text>
              <Text style={styles.orderSummaryTotal}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>

          {/* Note Input */}
          <TextInput
            style={styles.noteInput}
            placeholder="Ghi chú cho đơn hàng (tùy chọn)..."
            placeholderTextColor={COLORS.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <Button
            title="Gửi đơn đặt hàng"
            icon="send"
            onPress={handleSubmitOrder}
            fullWidth
          />
        </View>
      )}
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
  // Search
  searchContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
  },
  // Delivery
  deliverySection: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  deliveryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  deliveryOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deliveryOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  deliveryOptionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  deliveryOptionTextActive: {
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Categories
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  categoryTextActive: {
    color: COLORS.textLight,
  },
  // Products
  productsList: {
    flex: 1,
  },
  productsContent: {
    padding: SPACING.base,
    paddingBottom: 200,
  },
  productCard: {
    marginBottom: SPACING.md,
  },
  productCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  productDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  productStock: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  minOrderText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  // Quantity Controls
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  qtyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Order Summary
  orderSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  orderSummaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  orderSummaryInfo: {
    alignItems: 'center',
  },
  orderSummaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  orderSummaryCount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  orderSummaryTotal: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  noteInput: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    minHeight: 40,
  },
});
