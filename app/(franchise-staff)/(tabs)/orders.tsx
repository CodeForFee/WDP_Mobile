import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useOrder } from '@/hooks/useOrder';
import { OrderMyStore } from '@/type';
import { handleErrorApi } from '@/lib/errors';
import { OrdersTabScreen } from '@/components/order/OrdersTabScreen';

export default function OrdersTabRoute() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderMyStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await useOrder.getMyStoreOrders();
      setOrders(data);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

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
          onPress: async () => {
            setLoading(true);
            try {
              await useOrder.cancelOrder(orderId);
              Alert.alert('Thành công', 'Đã hủy đơn hàng');
              fetchOrders();
            } catch (error) {
              handleErrorApi({ error });
            } finally {
              setLoading(false);
            }
          },
        },
      ]);
    },
    [fetchOrders]
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
