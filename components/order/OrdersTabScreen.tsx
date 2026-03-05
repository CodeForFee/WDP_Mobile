import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/common';
import { COLORS } from '@/constants/theme';
import { OrderItem } from '@/components/order/OrderItem';

type OrderTabStatus = 'In progress' | 'Accepted' | 'Rejected';

export function OrdersTabScreen({ orders, loading, refreshing, onRefresh, onViewOrder }: any) {
  const [activeTab, setActiveTab] = useState<OrderTabStatus>('In progress');

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.filter((o) => {
      const status = o.status?.toLowerCase();
      if (activeTab === 'In progress') {
        return status === 'pending' || status === 'processing' || status === 'approved' || status === 'picking';
      }
      if (activeTab === 'Accepted') {
        return status === 'delivering' || status === 'completed' || status === 'delivered';
      }
      if (activeTab === 'Rejected') {
        return status === 'cancelled' || status === 'rejected' || status === 'claimed';
      }
      return false;
    });
  }, [orders, activeTab]);

  const renderHeader = () => (
    <View>
      <Text style={styles.headerTitle}>Orders</Text>
      <View style={styles.tabWrapper}>
        {(['In progress', 'Accepted', 'Rejected'] as OrderTabStatus[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && !refreshing && (
        <View style={styles.centerLoading}><LoadingSpinner size={32} color={COLORS.primary} /></View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyBox}>
        <Text style={{ color: '#999', fontWeight: '500' }}>No {activeTab.toLowerCase()} orders</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderItem order={item} onPress={onViewOrder} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={<View style={{ height: 100 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F0' },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginVertical: 15, color: '#1A1A1A' },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 0, // Moved inside paddingHorizontal of FlatList content
    borderRadius: 18,
    padding: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14 },
  tabBtnActive: { backgroundColor: '#89A54D' },
  tabText: { fontWeight: '700', color: '#666', fontSize: 13 },
  tabTextActive: { color: '#FFF' },
  listContent: { paddingHorizontal: 20 },
  centerLoading: { marginTop: 20, alignItems: 'center' },
  emptyBox: { alignItems: 'center', marginTop: 60 }
});
