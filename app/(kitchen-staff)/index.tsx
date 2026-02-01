import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Card, StatusBadge, StoreHeader, Sidebar } from '@/components/common';

const activeBatches = [
  { id: 'B001', name: 'Spicy Wings', count: 24, time: '3:24 AM', status: 'Cooking' },
  { id: 'B002', name: 'Classic Strips', count: 18, time: 'Complete', status: 'Complete' },
  { id: 'B003', name: 'Buffalo Bites', count: 12, time: '7m left', status: 'Cooking' },
];

export default function KitchenDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StoreHeader
        storeName="Kitchen Central"
        storeId="Production Dashboard"
        style={styles.header}
        onMenuPress={() => setSidebarVisible(true)}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        userRole="kitchen-staff"
        userName="Marcus Chen"
        userInfo="Central Kitchen • Production"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Alert */}
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={20} color={COLORS.textLight} />
            <Text style={styles.alertTitle}>Urgent Batch Alert</Text>
          </View>
          <Text style={styles.alertText}>
            Crispy Wings - Batch #2147 Ready for pickup
          </Text>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertButtonText}>Mark Ready</Text>
          </TouchableOpacity>
        </Card>

        {/* Production Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Production Overview</Text>

          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Ionicons name="cube" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Batches Produced</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Items Ready</Text>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="thermometer" size={20} color={COLORS.error} />
              </View>
              <View>
                <Text style={styles.infoValue}>375°F</Text>
                <Text style={styles.infoLabel}>Fryer Temp</Text>
              </View>
            </Card>
            <Card style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: COLORS.successLight }]}>
                <Ionicons name="time" size={20} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.infoValue}>12</Text>
                <Text style={styles.infoLabel}>Min Remaining</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Active Batches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Batches</Text>
            <TouchableOpacity style={styles.newBatchButton}>
              <Text style={styles.newBatchText}>New Batch</Text>
            </TouchableOpacity>
          </View>

          {activeBatches.map((batch) => (
            <Card key={batch.id} style={styles.batchCard}>
              <StatusBadge
                status={batch.status}
                type={batch.status === 'Complete' ? 'completed' : 'inProgress'}
                size="sm"
              />
              <View style={styles.batchInfo}>
                <Text style={styles.batchName}>{batch.name}</Text>
                <Text style={styles.batchDetails}>{batch.count} pieces</Text>
              </View>
              <Text style={styles.batchTime}>{batch.time}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Start Batch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="analytics" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons name="notifications" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: 110, // Added padding for floating tab bar
  },
  // Alert Card
  alertCard: {
    backgroundColor: COLORS.error,
    marginBottom: SPACING.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
  },
  alertText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: SPACING.md,
  },
  alertButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  // Section
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  newBatchButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  newBatchText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: 0,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: 0,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  // Batch Cards
  batchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  batchInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  batchName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  batchDetails: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  batchTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderDark, // Add border for visibility
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
