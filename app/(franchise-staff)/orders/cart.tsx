// ===== CONFIRM ORDER SCREEN – FIX VERSION =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image
} from 'react-native';
import { LoadingSpinner } from '@/components/common';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useStoreOrder } from '@/stores/storeOrder';
import { useOrder } from '@/hooks/useOrder';
import { handleErrorApi, EntityError } from '@/lib/errors';
import { COLORS } from '@/constants/theme';

export default function ConfirmOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { items, updateQuantity, removeItem, clearItems } = useStoreOrder();

  const [loading, setLoading] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // ================= VALIDATION =================

  const validateBeforeSend = () => {
    if (items.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng đang trống");
      return false;
    }

    if (deliveryDate <= new Date()) {
      Alert.alert("Lỗi", "Thời gian giao phải lớn hơn hiện tại");
      return false;
    }

    const invalidQty = items.find(i => !i.quantity || i.quantity <= 0);
    if (invalidQty) {
      Alert.alert("Lỗi", "Số lượng sản phẩm phải lớn hơn 0");
      return false;
    }

    return true;
  };

  // ================= BUILD PAYLOAD =================

  const buildPayload = () => {
    return {
      deliveryDate: deliveryDate.toISOString(),

      items: items.map(i => ({
        productId: Number(i.id),
        quantity: Number(i.quantity),
      }))
    };
  };

  // ================= CREATE ORDER =================

  const handleConfirmOrder = async () => {
    if (!validateBeforeSend()) return;

    const payload = buildPayload();

    console.log("======= ORDER PAYLOAD =======");
    console.log(JSON.stringify(payload, null, 2));

    // Chống NaN
    const hasInvalid = payload.items.some(
      x => isNaN(x.productId) || isNaN(x.quantity)
    );

    if (hasInvalid) {
      Alert.alert(
        "Lỗi dữ liệu",
        "Mã sản phẩm hoặc số lượng không hợp lệ"
      );
      return;
    }

    setLoading(true);

    try {
      const newOrder = await useOrder.createOrder(payload);

      // Success
      clearItems();
      router.replace({
        pathname: '/(franchise-staff)/orders/success',
        params: { id: newOrder.id }
      });

    } catch (error: any) {
      console.error("ORDER ERROR:", error);

      if (error instanceof EntityError) {
        const details = error.payload.errors
          .map((e: any) => `${e.field}: ${e.message}`)
          .join('\n');

        Alert.alert("Lỗi dữ liệu", details || error.message);

      } else if (error?.response?.data) {
        Alert.alert(
          "Lỗi từ Server",
          JSON.stringify(error.response.data, null, 2)
        );

      } else {
        handleErrorApi({ error });
      }

    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check & Confirm</Text>
        </View>

        <View style={styles.emptyBox}>
          <Ionicons name="cart-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Giỏ trống</Text>

          <TouchableOpacity style={styles.backToCreateBtn} onPress={() => router.back()}>
            <Text style={styles.backToCreateText}>Quay lại chọn sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Check & Confirm</Text>
      </View>

      <View style={styles.whiteCardContainer}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

          <Text style={styles.sectionTitle}>Thời gian giao hàng</Text>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dtBox}
              onPress={() => { setPickerMode('date'); setShowPicker(true); }}
            >
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text>{deliveryDate.toLocaleDateString('vi-VN')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dtBox}
              onPress={() => { setPickerMode('time'); setShowPicker(true); }}
            >
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text>
                {deliveryDate.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Chi tiết đơn
          </Text>

          {items.map((item, index) => (
            <View key={item.id ?? index} style={styles.itemRow}>

              <View style={styles.imageBox}>
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.productImage}
                  />
                ) : (
                  <Ionicons name="image-outline" size={24} color="#CCC" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {item.name || `Sản phẩm #${item.id}`}
                </Text>

                <Text style={styles.itemSub}>
                  {item.unit || 'unit'}
                </Text>
              </View>

              <View style={styles.qtyActions}>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  <Ionicons name="remove-circle-outline" size={28} />
                </TouchableOpacity>

                <Text style={styles.qtyVal}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Ionicons
                    name="add-circle"
                    size={28}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

            </View>
          ))}

        </ScrollView>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmOrder}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size={22} color="#FFF" />
          ) : (
            <Text style={styles.confirmText}>
              XÁC NHẬN GỬI ĐƠN
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={deliveryDate}
          mode={pickerMode}
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, date) => {
            setShowPicker(false);
            if (date) setDeliveryDate(date);
          }}
        />
      )}

    </View>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },

  backBtn: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    marginRight: 12
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },

  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: 10
  },

  dtBox: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8F8F8',
    borderRadius: 12
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },

  imageBox: {
    width: 50,
    height: 50,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10
  },

  itemName: { fontWeight: 'bold' },

  itemSub: { fontSize: 12, color: '#888' },

  qtyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },

  qtyVal: {
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center'
  },

  footer: {
    backgroundColor: '#FFF',
    padding: 16
  },

  confirmBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },

  confirmText: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyText: {
    marginVertical: 12,
    color: '#777'
  },

  backToCreateBtn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 12
  },

  backToCreateText: {
    color: '#FFF'
  }
});
