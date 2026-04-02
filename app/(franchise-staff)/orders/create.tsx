import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, Image } from 'react-native';
import { LoadingSpinner } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreOrder } from '@/stores/storeOrder';
import { useOrder } from '@/hooks/useOrder';
import { ProductCatalogDto } from '@/type';
import { COLORS } from '@/constants/theme';

import { PAGINATION_DEFAULT } from '@/constant';

export default function CreateOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, addItem, updateQuantity, removeItem } = useStoreOrder();
  const { useCatalog } = useOrder();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: catalog = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing
  } = useCatalog(PAGINATION_DEFAULT);


  const fetchCatalog = async () => {
    refetch();
  };

  const filteredCatalog = (catalog || []).filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const renderHeader = () => (
    <View style={styles.headerBackground}>
      <View style={styles.topActions}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleIcon}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo đơn hàng</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="I want to buy..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && <LoadingSpinner size={28} color={COLORS.primary} style={{ marginTop: 20 }} />}
    </View>
  );

  const renderItem = ({ item: product }: { item: ProductCatalogDto }) => {
    const inCart = items.find(i => i.id === product.id);
    return (
      <View style={styles.productItem}>
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={[styles.productImage, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={24} color="#CCC" />
            </View>
          )}
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productSub}>{product.unit || '1pcs'}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => inCart && (inCart.quantity > 1 ? updateQuantity(product.id, inCart.quantity - 1) : removeItem(product.id))}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={18} color="#555" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{inCart?.quantity || 0}</Text>

          <TouchableOpacity
            onPress={() => inCart ? updateQuantity(product.id, inCart.quantity + 1) : addItem({
              id: product.id,
              quantity: 1,
              name: product.name,
              unit: product.unit,
              image_url: product.imageUrl
            })}
            style={[styles.qtyBtn, { backgroundColor: COLORS.primary }]}
          >
            <Ionicons name="add" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredCatalog}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{ height: 100 + insets.bottom }} />}
        style={styles.whiteCardContainer}
        contentContainerStyle={styles.whiteCard}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchCatalog} />}
      />

      {items.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingCart, { bottom: 30 + insets.bottom }]}
          onPress={() => router.push('/(franchise-staff)/orders/cart' as any)}
        >
          <View style={styles.cartLeft}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
            </View>
            <Text style={styles.cartText}>View Cart</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#FFF' },
  headerBackground: { padding: 20, paddingTop: 10, paddingBottom: 20 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  circleIcon: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  topRightIcons: { flexDirection: 'row', gap: 10 },
  avatarContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  searchBar: { backgroundColor: '#F5F5F5', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  whiteCardContainer: { flex: 1, backgroundColor: '#FFF', overflow: 'hidden' },
  whiteCard: { padding: 20, paddingBottom: 0 },
  cardHeader: { marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  productItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  imageContainer: { marginRight: 15 },
  productImage: { width: 60, height: 60, borderRadius: 10 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productSub: { color: '#888', marginTop: 2 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 25, padding: 4 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  qtyText: { marginHorizontal: 12, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },
  floatingCart: { position: 'absolute', left: 20, right: 20, backgroundColor: '#000', borderRadius: 30, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  cartLeft: { flexDirection: 'row', alignItems: 'center' },
  cartBadge: { backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  cartBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  cartText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});