import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export function OrderItem({ order, onPress }: any) {
  const displayItems = order.items?.slice(0, 2) || [];

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(order.id)} 
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <View style={styles.idGroup}>
          <View style={[styles.dot, { backgroundColor: order.status === 'pending' ? '#89A54D' : '#FF9500' }]} />
          <Text style={styles.orderId}>Order #{order.id?.slice(0, 5).toUpperCase()}</Text>
        </View>
        {/* Đã bỏ logo message và nút > ở đây */}
      </View>

      <Text style={styles.timeText}>
        {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}
        {' / '}
        {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
      </Text>

      <View style={styles.productSpace}>
        {displayItems.map((item: any, index: number) => (
          <View key={index} style={styles.productRow}>
            <Image source={{ uri: item.product?.image || 'https://via.placeholder.com/100' }} style={styles.img} />
            <Text style={styles.productName} numberOfLines={1}>{item.product?.name}</Text>
            <Text style={styles.qty}>x{item.quantityRequested}</Text>
            {/* Đã bỏ dấu $ ở phần giá của từng món */}
            <Text style={styles.price}>{item.product?.price}</Text>
          </View>
        ))}
      </View>

      {/* Đã xóa phần Footer chứa Total Amount */}

      <View style={styles.statusBadge}>
        {/* Đổi Cooking thành Detail và dùng icon tìm kiếm/chi tiết */}
        <Ionicons name="search-outline" size={16} color="#5B7C2E" />
        <Text style={styles.statusText}>Detail</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 28, 
    padding: 20, 
    marginBottom: 16 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  idGroup: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 8 
  },
  orderId: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1A1A1A' 
  },
  timeText: { 
    fontSize: 12, 
    color: '#AAA', 
    marginVertical: 10, 
    fontWeight: '500' 
  },
  productSpace: { 
    marginVertical: 5 
  },
  productRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  img: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    marginRight: 12, 
    backgroundColor: '#F9F9F9' 
  },
  productName: { 
    flex: 1, 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#333' 
  },
  qty: { 
    color: '#BBB', 
    marginRight: 15, 
    fontSize: 14 
  },
  price: { 
    fontWeight: '800', 
    fontSize: 14, 
    color: '#1A1A1A', 
    width: 40, 
    textAlign: 'right' 
  },
  statusBadge: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8F9F4', 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 5, 
    gap: 8 
  },
  statusText: { 
    color: '#5B7C2E', 
    fontWeight: '700'
  }
});