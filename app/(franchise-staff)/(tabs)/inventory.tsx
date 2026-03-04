import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AddItemButton } from '@/components/inventory/AddItemButton';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { useInventory } from '@/hooks/useInventory';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingSpinner } from '@/components/common';
import { COLORS } from '@/constants/theme';
import { handleErrorApi } from '@/lib/errors';
import { InventoryItem } from '@/type';

export default function StoreInventoryScreen() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await useInventory.getStoreInventory();
      console.log('[StoreInventoryScreen] Inventory API Response:', res);
      const data = (res as any)?.items || res;

      if (Array.isArray(data)) {
        const mappedData = data.map((item: InventoryItem) => ({
          id: String(item.inventoryId || item.batchId),
          name: item.productName || 'Unknown Product',
          calories: 'N/A',
          stock: item.quantity,
          maxStock: 100, // Default or should be from API
          price: 0,
          image: item.imageUrl,
          description: item.sku || '',
        }));
        console.log('[StoreInventoryScreen] Mapped Inventory Items:', mappedData);
        setInventoryItems(mappedData);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInventory();
    }, [fetchInventory])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInventory();
  }, [fetchInventory]);

  const renderHeader = () => (
    <View>
      <AddItemButton onPress={() => console.log('Add Item Clicked')} />
      {loading && !refreshing && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <LoadingSpinner size={32} color={COLORS.primary} />
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={{ height: 100 }}>
      {inventoryItems.length === 0 && !loading && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#999' }}>No inventory items found</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <InventoryCard
              item={item}
              onPress={() => console.log('Detail', item.id)}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F0' },
  listContent: { paddingHorizontal: 20, paddingTop: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  cardWrapper: {
    width: '48%', // Khoảng 2 cột
  }
});
