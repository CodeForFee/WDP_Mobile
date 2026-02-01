import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Header, Button } from '@/components/common';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '@/constants/theme';

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
  },
  'C-1003': {
    id: 'C-1003',
    region: 'West District',
    date: '2023-10-25',
    status: 'Processing',
    orders: [
      { id: 'ORD-301', store: 'Store #301', items: 15, total: '$600.00' },
    ]
  }
};

export default function ConsolidationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const group = CONSOLIDATION_DETAILS['C-1001'];

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

  const renderOrder = ({ item }: any) => (
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
      <Header
        title={`Consolidation ${id || ''}`}
        showBack
        onBack={() => router.back()}
      />

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
                {group.orders.reduce((sum: number, ord: any) => sum + ord.items, 0)}
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
          showsVerticalScrollIndicator={false}
        />

        {group.status === 'Pending' && (
          <Button
            title="Confirm & Send to Kitchen"
            onPress={handleConsolidate}
            fullWidth
            size="lg"
            style={styles.consolidateButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  summaryCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  regionName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  summaryDate: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: SPACING.lg,
  },
  orderCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  storeName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  orderId: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderMeta: {
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  consolidateButton: {
    marginTop: SPACING.sm,
  },
});
