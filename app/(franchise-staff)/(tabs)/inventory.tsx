import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { useInventory } from '@/hooks/useInventory';
import { LoadingSpinner } from '@/components/common';
import { COLORS } from '@/constants/theme';
import { InventoryItem } from '@/type';
import { PAGINATION_DEFAULT } from '@/constant';
import { useRouter } from 'expo-router';

export default function StoreInventoryScreen() {
  const router = useRouter();
  const { useStoreInventory } = useInventory();
  const {
    data: rawData = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing
  } = useStoreInventory(PAGINATION_DEFAULT);

  const inventoryItems = React.useMemo(() => {
    return rawData.map((item: InventoryItem) => ({
      id: String(item.inventoryId || item.batchId),
      name: item.productName || 'Unknown Product',
      calories: 'N/A',
      stock: item.quantity,
      maxStock: 100,
      price: 0,
      image: item.imageUrl,
      description: item.sku || '',
    }));
  }, [rawData]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Quản lý tồn kho</Text>
          <Text style={styles.headerTitle}>Kho hàng của tôi</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add')}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <InventoryCard
              item={item}
              onPress={() => router.push(`/ (franchise - staff) / inventory / ${item.id} `)}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào trong kho</Text>
            </View>
          ) : null
        }
      />
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner size={40} color={COLORS.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  cardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 50,
  }
});
