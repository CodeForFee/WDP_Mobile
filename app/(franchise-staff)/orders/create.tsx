import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Image } from 'react-native';
import { LoadingSpinner } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreOrder } from '@/stores/storeOrder';
import { useOrder } from '@/hooks/useOrder';
import { Product } from '@/type';
import { handleErrorApi } from '@/lib/errors';
import { COLORS } from '@/constants/theme';

/**
 * Trang tạo đơn: chỉ chọn món (thêm giỏ). Không chọn ngày/giờ, không gọi API tạo đơn.
 * "View Cart" → chuyển sang orders/cart để chọn ngày/giờ và xác nhận (API gọi ở đó).
 */
export default function CreateOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, addItem, updateQuantity, removeItem } = useStoreOrder();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ["Bakery", "Spring onions", "Bananas", "Pizza", "Cake"];

  useEffect(() => { fetchCatalog(); }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await useOrder.getCatalog();
      // Cast to Product[] assuming API returns imageUrl etc.
      setCatalog(data as unknown as Product[]);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredCatalog = catalog.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.headerBackground}>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.circleIcon}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.topRightIcons}>
            {/* Avatar: Using a user icon for now as specific avatar URL isn't in User type */}
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={20} color="#666" />
            </View>
          </View>
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.tag}><Text style={styles.tagText}>{cat}</Text></TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <View style={styles.whiteCardContainer}>
        <View style={styles.whiteCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Shopping list</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchCatalog} />}
            contentContainerStyle={{ paddingBottom: 100 + insets.bottom }} // Extra padding for floating cart + safe area
          >
            {loading && <LoadingSpinner size={28} color={COLORS.primary} style={{ marginTop: 20 }} />}
            {filteredCatalog.map((product) => {
              const inCart = items.find(i => i.id === product.id);
              return (
                <View key={product.id} style={styles.productItem}>
                  {/* Product Image */}
                  <View style={styles.imageContainer}>
                    {product.imageUrl ? (
                      <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.productImage, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="image-outline" size={24} color="#CCC" />
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productSub}>{product.unit || '1pcs'}</Text>
                  </View>

                  {/* Quantity Controls */}
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
                        image_url: product.image_url
                      })}
                      style={[styles.qtyBtn, { backgroundColor: COLORS.primary }]}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {items.length > 0 && (
        <View style={[styles.floatingCart, { bottom: 30 + insets.bottom }]}>
          <TouchableOpacity
            style={styles.cartContent}
            onPress={() => router.push('/(franchise-staff)/orders/cart' as any)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.cartIconBadge}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{items.length}</Text>
              </View>
              <Text style={styles.viewCartText}> View Cart</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  headerBackground: { padding: 20, paddingTop: 10, paddingBottom: 20 },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  circleIcon: { backgroundColor: '#FFF', width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  topRightIcons: { flexDirection: 'row', gap: 10 },
  avatarContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  searchBar: { backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  tagScroll: { marginTop: 15 },
  tag: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tagText: { fontWeight: '600', color: '#FFF' },
  whiteCardContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden' },
  whiteCard: { flex: 1, padding: 20, paddingBottom: 0 },
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
  floatingCart: { position: 'absolute', left: 20, right: 20, backgroundColor: '#000', borderRadius: 30, height: 60, justifyContent: 'center', paddingHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  cartContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartIconBadge: { backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  viewCartText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});