import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useOrder } from '@/hooks/useOrder';
import { OrdersTabScreen } from '@/components/order/OrdersTabScreen';

export default function OrdersTabRoute() {
  const router = useRouter();
  const { useMyStoreOrders } = useOrder();

  const {
    data,
    isLoading: loading,
    isRefetching: refreshing,
    isError,
    refetch,
  } = useMyStoreOrders({ sortOrder: 'DESC' });

  const allOrders = data ?? [];

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
      onCreateOrder={handleCreateOrder}
      isError={isError}
    />
  );
}
