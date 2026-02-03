import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AddItemButton } from '@/components/inventory/AddItemButton';
import { InventoryCard } from '@/components/inventory/InventoryCard';

export default function StoreInventoryScreen() {
  const inventoryItems = [
    {
      id: '1',
      name: 'Beef Burger',
      calories: '450 cal',
      stock: 25,
      maxStock: 25,
      price: 14,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      description: 'Homemade beef cutlet with signature...',
    },
    {
      id: '2',
      name: 'Meat Grill',
      calories: '450 cal',
      stock: 23,
      maxStock: 25,
      price: 14,
      image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=300',
      description: 'Homemade beef cutlet with signature...',
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header gọn gàng */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-sharp" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

        {/* Nút Add Item ở vị trí cũ phía trên Grid */}
        <AddItemButton onPress={() => console.log('Add Item Clicked')} />

        <View style={styles.grid}>
          {inventoryItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onPress={() => console.log('Detail', item.id)}
            />
          ))}
        </View>
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