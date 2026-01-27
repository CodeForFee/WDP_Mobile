import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DELIVERIES = [
  { id: 'TRK-8821', driver: 'Nguyen Van A', vehicle: 'Truck 29C-123.45', route: 'Route A', status: 'On Route', progress: 0.6 },
  { id: 'TRK-9932', driver: 'Tran Van B', vehicle: 'Van 29D-567.89', route: 'Route B', status: 'Loading', progress: 0 },
];

export default function CoordinatorDeliveryScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.vehicle}>{item.vehicle}</Text>
        <View style={[styles.statusBadge, item.status === 'On Route' ? styles.bgActive : styles.bgPending]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.driver}>Driver: {item.driver}</Text>
      <Text style={styles.route}>{item.route}</Text>

      {item.status === 'On Route' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="map-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Deliveries</Text>
      <FlatList
        data={DELIVERIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  vehicle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bgActive: { backgroundColor: '#cce5ff' },
  bgPending: { backgroundColor: '#fff3cd' },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  driver: {
    color: '#666',
    marginTop: 5,
  },
  route: {
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
