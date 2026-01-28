import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { Header } from '@/src/components/common/Header';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const CONSOLIDATED_ORDERS = [
  { id: 'C-1001', date: '2023-10-25', totalOrders: 3, totalItems: 25, status: 'Consolidated', region: 'North District' },
  { id: 'C-1002', date: '2023-10-25', totalOrders: 2, totalItems: 15, status: 'Pending', region: 'South District' },
  { id: 'C-1003', date: '2023-10-25', totalOrders: 4, totalItems: 42, status: 'Processing', region: 'West District' },
];

export default function CoordinatorOrdersScreen() {
  const router = useRouter();

  const getStatusType = (status: string) => {
    switch (status) {
      case 'Consolidated': return 'success';
      case 'Processing': return 'info';
      default: return 'warning';
    }
  };

  const renderItem = ({ item }: any) => (
    <Card
      style={styles.card}
      onPress={() => router.push(`/(coordinator)/orders/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.id}>{item.id}</Text>
          <Text style={styles.region}>{item.region}</Text>
        </View>
        <StatusBadge status={item.status} type={getStatusType(item.status) as any} size="sm" />
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalItems}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.date.split('-')[1]}/{item.date.split('-')[2]}</Text>
          <Text style={styles.statLabel}>Date</Text>
        </View>
      </View>

      {item.status === 'Pending' && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Start Consolidation</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Order Consolidation"
        // subtitle="Manage Incoming Requests"
        rightElement={
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={CONSOLIDATED_ORDERS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  id: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  region: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
