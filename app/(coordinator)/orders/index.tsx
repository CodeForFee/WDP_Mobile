import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';

// Mock data
const CONSOLIDATED_ORDERS = [
  { id: 'C-1001', date: '2023-10-25', totalOrders: 3, totalItems: 25, status: 'Consolidated', region: 'North District' },
  { id: 'C-1002', date: '2023-10-25', totalOrders: 2, totalItems: 15, status: 'Pending', region: 'South District' },
];

export default function CoordinatorOrdersScreen() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <Card onPress={() => router.push(`/(coordinator)/orders/${item.id}`)}>
      <View style={styles.header}>
        <Text style={styles.id}>{item.id}</Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Region:</Text>
        <Text style={styles.value}>{item.region}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Orders:</Text>
        <Text style={styles.value}>{item.totalOrders}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total Items:</Text>
        <Text style={styles.value}>{item.totalItems}</Text>
      </View>

      {item.status === 'Pending' && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Process Consolidation</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Consolidation</Text>
      <FlatList
        data={CONSOLIDATED_ORDERS}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
    color: '#333',
  },
  button: {
    backgroundColor: '#34C759',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
