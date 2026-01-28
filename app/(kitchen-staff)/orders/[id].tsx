import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Mock Data for Detail View
const ORDER_DETAILS = {
  '1': {
    id: '1',
    store: 'Store #123',
    date: '2023-10-25',
    status: 'Pending',
    priority: 'High',
    items: [
      { id: 'p1', name: 'Burger Buns', quantity: 50, unit: 'pack' },
      { id: 'p2', name: 'Beef Patties', quantity: 20, unit: 'kg' },
      { id: 'p3', name: 'Cheddar Cheese', quantity: 10, unit: 'kg' },
    ]
  },
  '2': {
    id: '2',
    store: 'Store #124',
    date: '2023-10-25',
    status: 'Processing',
    priority: 'Normal',
    items: [
      { id: 'p4', name: 'Tomato Sauce', quantity: 5, unit: 'tub' },
      { id: 'p5', name: 'French Fries', quantity: 15, unit: 'box' },
    ]
  }
};

export default function KitchenOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const order = ORDER_DETAILS[id as string] || ORDER_DETAILS['1']; // Fallback for demo
  const [status, setStatus] = useState(order.status);

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert(
      "Update Status",
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setStatus(newStatus);
            // In a real app, API call goes here
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Order Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.storeName}>{order.store}</Text>
            <View style={[styles.statusBadge,
            status === 'Pending' ? styles.statusPending :
              status === 'Processing' ? styles.statusProcessing : styles.statusReady
            ]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          <Text style={styles.date}>Placed on: {order.date}</Text>
          <Text style={[styles.priority, order.priority === 'High' ? styles.textHigh : null]}>
            Priority: {order.priority}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Order Items</Text>

        <FlatList
          data={order.items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {status === 'Pending' && (
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleUpdateStatus('Processing')}
            >
              <Text style={styles.buttonText}>Accept & Start Production</Text>
            </TouchableOpacity>
          )}

          {status === 'Processing' && (
            <TouchableOpacity
              style={[styles.button, styles.readyButton]}
              onPress={() => handleUpdateStatus('Ready')}
            >
              <Text style={styles.buttonText}>Mark as Ready for Dispatch</Text>
            </TouchableOpacity>
          )}

          {status === 'Ready' && (
            <View style={styles.completedMessage}>
              <Ionicons name="checkmark-circle" size={24} color="#28a745" />
              <Text style={styles.completedText}>Order Ready for Coordinator</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: { backgroundColor: '#FFEeba' },
  statusProcessing: { backgroundColor: '#b8daff' },
  statusReady: { backgroundColor: '#c3e6cb' },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  date: {
    color: '#666',
    marginBottom: 5,
  },
  priority: {
    color: '#666',
    fontWeight: '500',
  },
  textHigh: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  list: {
    flexGrow: 0,
    marginBottom: 20,
  },
  listContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionContainer: {
    marginTop: 'auto',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  readyButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 10,
    gap: 10,
  },
  completedText: {
    color: '#155724',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
