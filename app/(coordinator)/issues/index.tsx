import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';

const ISSUES = [
  { id: 'ISS-001', type: 'Missing Items', orderId: 'ORD-1023', reportedBy: 'Store #123', status: 'Open', priority: 'High', date: '2023-10-25' },
  { id: 'ISS-002', type: 'Delivery Delay', orderId: 'ORD-1011', reportedBy: 'Logistics', status: 'In Progress', priority: 'Medium', date: '2023-10-24' },
];

export default function CoordinatorIssuesScreen() {
  const handleResolve = (id: string) => {
    Alert.alert('Issue Details', `View details for issue ${id}`);
  };

  const renderItem = ({ item }) => (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="alert-circle-outline" size={22} color={item.priority === 'High' ? '#dc3545' : '#ffc107'} />
          <Text style={styles.issueType}>{item.type}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.refText}>Ref: {item.orderId}</Text>
      <Text style={styles.reporter}>Reported by: {item.reportedBy}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>

      <TouchableOpacity
        style={styles.resolveButton}
        onPress={() => handleResolve(item.id)}
      >
        <Text style={styles.resolveButtonText}>View Details & Resolve</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue Management</Text>
      <FlatList
        data={ISSUES}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refText: {
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  reporter: {
    color: '#666',
    marginBottom: 4,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginBottom: 15,
  },
  resolveButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resolveButtonText: {
    fontWeight: '600',
    color: '#333',
  },
});
