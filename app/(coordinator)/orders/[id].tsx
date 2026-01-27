import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';

// Mock Data
const CONSOLIDATION_DETAILS = {
  'C-1001': {
    id: 'C-1001',
    region: 'North District',
    date: '2023-10-25',
    status: 'Consolidated',
    orders: [
      { id: 'ORD-101', store: 'Store #101', items: 12, total: '$450.00' },
      { id: 'ORD-102', store: 'Store #102', items: 8, total: '$320.00' },
      { id: 'ORD-103', store: 'Store #103', items: 5, total: '$150.00' },
    ]
  },
  'C-1002': {
    id: 'C-1002',
    region: 'South District',
    date: '2023-10-25',
    status: 'Pending',
    orders: [
      { id: 'ORD-201', store: 'Store #201', items: 10, total: '$400.00' },
      { id: 'ORD-202', store: 'Store #202', items: 5, total: '$200.00' },
    ]
  }
};

export default function ConsolidationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const group = CONSOLIDATION_DETAILS[id as string] || CONSOLIDATION_DETAILS['C-1001'];

  const handleConsolidate = () => {
    Alert.alert(
      'Confirm Consolidation',
      'This will merge these orders into a production batch. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log(`Consolidated group ${group.id}`);
            router.back();
          }
        }
      ]
    );
  };

  const renderOrder = ({ item }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.orderId}>{item.id}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderMeta}>{item.items} Items</Text>
        <Text style={styles.orderMeta}>{item.total}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consolidation {id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.regionName}>{group.region}</Text>
            <StatusBadge status={group.status} />
          </View>
          <Text style={styles.summaryDate}>Date: {group.date}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{group.orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {group.orders.reduce((sum, ord) => sum + ord.items, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Included Orders</Text>

        <FlatList
          data={group.orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />

        {group.status === 'Pending' && (
          <TouchableOpacity style={styles.consolidateButton} onPress={handleConsolidate}>
            <Text style={styles.buttonText}>Confirm & Send to Kitchen</Text>
          </TouchableOpacity>
        )}
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
  summaryCard: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  regionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryDate: {
    color: '#666',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    marginBottom: 10,
    padding: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderId: {
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderMeta: {
    color: '#555',
    fontWeight: '500',
  },
  consolidateButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
