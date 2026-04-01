import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useOrder } from '@/hooks/useOrder';
import { handleErrorApi } from '@/lib/errors';
import { OrdersTabScreen } from '@/components/order/OrdersTabScreen';
import { Alert } from 'react-native';

const PAGE_SIZE = 10;

export default function OrdersTabRoute() {
  const router = useRouter();
  const { useMyStoreOrders, cancelOrderMutation } = useOrder();
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: orders = [],
    isLoading: loading,
    isRefetching: refreshing,
    isFetchingNextPage,
    isError,
    refetch,
  } = useMyStoreOrders({ sortOrder: 'DESC', page, limit: PAGE_SIZE });

  // Sync data from query into local state
  // page === 1 → replace (fresh load or refresh)
  // page > 1  → append (load more / infinite scroll)
  useEffect(() => {
    if (!orders) return;
    if (page === 1) {
      setAllOrders(orders);
    } else {
      setAllOrders((prev) => {
        const existingIds = new Set(prev.map((o) => o.id));
        const newItems = orders.filter((o) => !existingIds.has(o.id));
        return newItems.length > 0 ? [...prev, ...newItems] : prev;
      });
    }
    setHasMore(orders.length === PAGE_SIZE);
  }, [orders, page]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setAllOrders([]);
    setHasMore(true);
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isFetchingNextPage, hasMore]);

  const handleViewOrder = useCallback(
    (orderId: string) => {
      if (!orderId || orderId === 'index' || orderId === 'create') return;
      router.push(`/(franchise-staff)/orders/${orderId}` as any);
    },
    [router]
  );

  const handleCancelOrder = useCallback(
    (orderId: string) => {
      Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy đơn hàng này?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: () => {
            cancelOrderMutation.mutate(orderId, {
              onSuccess: () => {
                Alert.alert('Thành công', 'Đã hủy đơn hàng');
                handleRefresh();
              },
              onError: (error) => {
                handleErrorApi({ error });
              },
            });
          },
        },
      ]);
    },
    [cancelOrderMutation, handleRefresh]
  );

  const handleCreateOrder = useCallback(() => {
    router.push('/(franchise-staff)/orders/create' as any);
  }, [router]);

  return (
    <OrdersTabScreen
      orders={allOrders}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onViewOrder={handleViewOrder}
      onCancelOrder={handleCancelOrder}
      onCreateOrder={handleCreateOrder}
      onLoadMore={handleLoadMore}
      isFetchingNextPage={isFetchingNextPage}
      isError={isError}
    />
  );
}
