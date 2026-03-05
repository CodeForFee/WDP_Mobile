import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useOrder } from '@/hooks/useOrder';
import { handleErrorApi } from '@/lib/errors';
import { OrdersTabScreen } from '@/components/order/OrdersTabScreen';

import { PAGINATION_DEFAULT } from '@/constant';

export default function OrdersTabRoute() {
  const router = useRouter();
  const { useMyStoreOrders, cancelOrderMutation } = useOrder();
  const {
    data: orders = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing
  } = useMyStoreOrders(PAGINATION_DEFAULT);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleViewOrder = useCallback(
    (orderId: string) => {
      if (!orderId || orderId === 'index' || orderId === 'create') return;
      router.push(`/(franchise-staff)/orders/${orderId}` as any);
    },
    [router]
  );

  const handleCancelOrder = useCallback(
    (orderId: string) => {
      const { Alert } = require('react-native');
      Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy đơn hàng này?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: () => {
            cancelOrderMutation.mutate(orderId, {
              onSuccess: () => {
                Alert.alert('Thành công', 'Đã hủy đơn hàng');
                refetch();
              },
              onError: (error) => {
                handleErrorApi({ error });
              },
            });
          },
        },
      ]);
    },
    [cancelOrderMutation, refetch]
  );

  const handleCreateOrder = useCallback(() => {
    router.push('/(franchise-staff)/orders/create' as any);
  }, [router]);

  return (
    <OrdersTabScreen
      orders={orders}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onViewOrder={handleViewOrder}
      onCancelOrder={handleCancelOrder}
      onCreateOrder={handleCreateOrder}
    />
  );
}
