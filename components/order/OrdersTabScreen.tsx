import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/common';
import { COLORS } from '@/constants/theme';
import { OrderItem } from '@/components/order/OrderItem';

type OrderTabStatus = 'In progress' | 'Accepted' | 'Rejected';

export function OrdersTabScreen({
  orders,
  loading,
  refreshing,
  onRefresh,
  onViewOrder,
  onCreateOrder,
  onLoadMore,
  isFetchingNextPage,
  isError,
}: {
  orders: any[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onViewOrder: (id: string) => void;
  onCreateOrder: () => void;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
  isError?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<OrderTabStatus>('In progress');

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.filter((o) => {
      const status = o.status?.toLowerCase();
      if (activeTab === 'In progress') {
        return (
          status === 'pending' ||
          status === 'waiting_for_production' ||
          status === 'approved' ||
          status === 'picking' ||
          status === 'delivering' ||
          status === 'claimed'
        );
      }
      if (activeTab === 'Accepted') {
        return status === 'completed';
      }
      if (activeTab === 'Rejected') {
        return status === 'cancelled' || status === 'rejected';
      }
      return false;
    });
  }, [orders, activeTab]);

  const renderHeader = () => (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.createBtn} onPress={onCreateOrder}>
          <Text style={styles.createBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
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

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View style={{ height: 20 }} />;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  };

  const renderError = () => {
    if (!isError) return null;
    return (
      <View style={styles.errorBanner}>
        <Text style={styles.errorText}>Failed to load orders. Pull to refresh.</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.errorRetry}>Retry</Text>
        </TouchableOpacity>
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
        ListHeaderComponent={() => (
          <>
            {renderError()}
            {renderHeader()}
          </>
        )}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
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
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15, paddingHorizontal: 4 },
  createBtn: { backgroundColor: '#89A54D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  createBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
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
  emptyBox: { alignItems: 'center', marginTop: 60 },
  errorBanner: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { color: '#DC2626', fontSize: 13, fontWeight: '500' },
  errorRetry: { color: '#DC2626', fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
});
