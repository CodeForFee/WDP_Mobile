import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { Header } from '@/src/components/common/Header';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '@/src/constants/theme';

const ISSUES = [
  { id: 'ISS-001', type: 'Missing Items', orderId: 'ORD-1023', reportedBy: 'Store #123', status: 'Open', priority: 'High', date: '2023-10-25' },
  { id: 'ISS-002', type: 'Delivery Delay', orderId: 'ORD-1011', reportedBy: 'Logistics', status: 'In Progress', priority: 'Medium', date: '2023-10-24' },
];

export default function CoordinatorIssuesScreen() {
  const handleResolve = (id: string) => {
    Alert.alert('Issue Details', `View details for issue ${id}`);
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'High' ? COLORS.error : COLORS.warning;
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="alert-circle-outline" size={22} color={getPriorityColor(item.priority)} />
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
      <Header
        title="Issue Management"
        rightElement={
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        }
      />
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
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: 100,
  },
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  issueType: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  refText: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  reporter: {
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  resolveButton: {
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  resolveButtonText: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
});
