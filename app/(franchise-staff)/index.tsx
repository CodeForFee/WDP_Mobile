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
import { useSessionStore } from '@/stores/storeSession';

export default function FranchiseDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const session = useSessionStore();
  return (
    <View style={styles.container}>
      {/* Header */}
      <StoreHeader
        storeName={session.user?.email || 'Franchise Staff'}
        storeId="Downtown Plaza"
        style={styles.header}
        onMenuPress={() => setSidebarVisible(true)}
      />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        userRole="franchise-staff"
        userName="John Smith"
        userInfo="Store #247 • Downtown Plaza"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Store Open</Text>
              <Text style={styles.statusSubtext}>Operating normally</Text>
            </View>
            <View style={styles.statusToggle}>
              <Ionicons name="power" size={24} color={COLORS.success} />
            </View>
          </View>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>$</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Today Sales</Text>
              <Text style={styles.statValue}>$2,847</Text>
              <Text style={styles.statChange}>+12%</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="cart" size={24} color={COLORS.primary} />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Orders</Text>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statChange}>+8%</Text>
            </View>
          </Card>
        </View>

        <View style={styles.statsGridSmall}>
          <Card style={styles.smallStatCard}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.smallStatValue}>8 min</Text>
            <Text style={styles.smallStatLabel}>Avg Wait</Text>
          </Card>

          <Card style={styles.smallStatCard}>
            <Ionicons name="star" size={20} color={COLORS.warning} />
            <Text style={styles.smallStatValue}>4.8/5</Text>
            <Text style={styles.smallStatLabel}>Rating</Text>
          </Card>
        </View>

        {/* Stock Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stock Alerts</Text>
            <StatusBadge status="3 Critical" type="urgent" size="sm" />
          </View>

          <Card style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning" size={20} color={COLORS.error} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Chicken Wings</Text>
              <Text style={styles.alertSubtext}>Only 12 lbs left</Text>
            </View>
            <TouchableOpacity style={styles.alertAction}>
              <Text style={styles.alertActionText}>Order Now</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.alertCard}>
            <View style={[styles.alertIcon, { backgroundColor: COLORS.warningLight }]}>
              <Ionicons name="water" size={20} color={COLORS.warningDark} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Flour</Text>
              <Text style={styles.alertSubtext}>25 lbs remaining</Text>
            </View>
          </Card>

          <Card style={styles.alertCard}>
            <View style={[styles.alertIcon, { backgroundColor: COLORS.warningLight }]}>
              <Ionicons name="flask" size={20} color={COLORS.warningDark} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Cooking Oil</Text>
              <Text style={styles.alertSubtext}>8 gallons left</Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="add" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>New Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="cube" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Inventory</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="people" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Staff</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="bar-chart" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Reports</Text>
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
  // Status Card
  statusCard: {
    backgroundColor: COLORS.success,
    marginBottom: SPACING.base,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textLight,
  },
  statusSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statusToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: 0,
  },
  statIcon: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  statChange: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Small Stats
  statsGridSmall: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  smallStatCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: SPACING.md,
  },
  smallStatValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  smallStatLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
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
  },
  // Alert Cards
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  alertSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  alertAction: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  alertActionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Actions Grid
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
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
