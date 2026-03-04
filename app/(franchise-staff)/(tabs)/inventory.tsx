import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AddItemButton } from '@/components/inventory/AddItemButton';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { useInventory, InventoryStoreItem } from '@/hooks/useInventory';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingSpinner } from '@/components/common';
import { COLORS } from '@/constants/theme';
import { handleErrorApi } from '@/lib/errors';

export default function StoreInventoryScreen() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await useInventory.getInventoryStore();
      console.log('[StoreInventoryScreen] Inventory API Response:', res);
      const data = (res as any)?.items || res;

      if (Array.isArray(data)) {
        const mappedData = data.map((item: InventoryStoreItem) => ({
          id: item.id,
          name: item.product?.name || 'Unknown Product',
          calories: 'N/A', // Not in current API
          stock: item.availableQuantity,
          maxStock: item.maxStockLevel,
          price: 0, // Not in current inventory API
          image: item.product?.imageUrl,
          description: item.product?.sku || '',
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

  console.log('[StoreInventoryScreen] Rendering - items count:', inventoryItems.length);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInventory();
  }, [fetchInventory]);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}
      >

        {/* Nút Add Item ở vị trí cũ phía trên Grid */}
        <AddItemButton onPress={() => console.log('Add Item Clicked')} />

        {loading && !refreshing && (
          <View style={{ marginTop: 20, alignItems: 'center' }}><LoadingSpinner size={32} color={COLORS.primary} /></View>
        )}

        <View style={styles.grid}>
          {inventoryItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onPress={() => console.log('Detail', item.id)}
            />
          ))}
        </View>

        {inventoryItems.length === 0 && !loading && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#999' }}>No inventory items found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  settingsBtn: { backgroundColor: '#FFF', padding: 10, borderRadius: 14 },
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});