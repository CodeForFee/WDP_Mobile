import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../../src/constants/theme';
import { Card, StatusBadge, StoreHeader, Sidebar } from '../../src/components/common';

const quickLogItems = [
  { id: '1', icon: 'cube', label: 'Batch Chk', color: COLORS.primary },
  { id: '2', icon: 'thermometer', label: 'Temp Chks', color: COLORS.error },
  { id: '3', icon: 'cube', label: 'Inventory', color: COLORS.success },
  { id: '4', icon: 'brush', label: 'Cleaning', color: COLORS.info },
];

const activityTimeline = [
  { id: '1', title: 'Batch Cooked - Spicy Wings', time: '9:42 AM', user: 'Marcus Chen', role: 'Kitchen', status: 'completed' },
  { id: '2', title: 'Temperature Check', subtitle: 'All equipment passed > 165°F', time: '9:30 AM', user: 'Sarah Williams', status: 'completed' },
  { id: '3', title: 'Inventory Alert', subtitle: 'Chicken breasts low stock', time: '9:15 AM', user: 'James Rodriguez', role: 'Inventory', status: 'warning' },
  { id: '4', title: 'Deep Clean Completed', subtitle: 'Fryer stations sanitized', time: '9:00 AM', user: 'Emily Davis', role: 'Kitchen', status: 'completed' },
  { id: '5', title: 'Batch Cooked - Classic Tenders', time: '8:45 AM', user: 'David Kim', status: 'completed' },
  { id: '6', title: 'Store Opened', subtitle: 'All systems operational', time: '6:00 AM', user: 'Sarah Williams', role: 'Manager', status: 'info' },
];

export default function CoordinatorDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StoreHeader
        storeName="Store #420"
        storeId="Daily Operations"
        style={styles.header}
        onMenuPress={() => setSidebarVisible(true)}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        userRole="coordinator"
        userName="Sarah Williams"
        userInfo="Supply Coordinator • HQ"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Operations Card */}
        <Card style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <View>
              <Text style={styles.dailyTitle}>Daily Operations</Text>
              <Text style={styles.dailyDate}>Thursday, Jan 15, 2026</Text>
            </View>
            <View style={styles.shiftBadge}>
              <Text style={styles.shiftLabel}>Current Shift</Text>
              <Text style={styles.shiftValue}>Morning - 6:00 AM</Text>
              <Text style={styles.shiftDuration}>Duration: 3h 56m</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.dailyStats}>
            <View style={styles.dailyStatItem}>
              <Text style={styles.dailyStatValue}>124</Text>
              <Text style={styles.dailyStatLabel}>Orders</Text>
            </View>
            <View style={styles.dailyStatItem}>
              <Text style={[styles.dailyStatValue, { color: COLORS.success }]}>$2.4K</Text>
              <Text style={styles.dailyStatLabel}>Revenue</Text>
            </View>
            <View style={styles.dailyStatItem}>
              <Text style={styles.dailyStatValue}>8</Text>
              <Text style={styles.dailyStatLabel}>Staff</Text>
            </View>
          </View>
        </Card>

        {/* Quick Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <View style={styles.quickLogGrid}>
            {quickLogItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.quickLogItem}>
                <View style={[styles.quickLogIcon, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={styles.quickLogLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {activityTimeline.map((activity, index) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityDot,
                  activity.status === 'warning' && { backgroundColor: COLORS.warning },
                  activity.status === 'info' && { backgroundColor: COLORS.info },
                ]}>
                  {activity.status === 'completed' && (
                    <Ionicons name="checkmark" size={10} color={COLORS.textLight} />
                  )}
                </View>
                {index < activityTimeline.length - 1 && <View style={styles.activityLine} />}
              </View>

              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                {activity.subtitle && (
                  <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                )}
                <View style={styles.activityUser}>
                  <Ionicons name="person-circle" size={16} color={COLORS.textMuted} />
                  <Text style={styles.activityUserName}>{activity.user}</Text>
                  {activity.role && (
                    <View style={styles.activityRoleBadge}>
                      <Text style={styles.activityRoleText}>{activity.role}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
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
  // Daily Card
  dailyCard: {
    marginBottom: SPACING.lg,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  dailyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  dailyDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  shiftBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'flex-end',
  },
  shiftLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  shiftValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  shiftDuration: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
  },
  dailyStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  dailyStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  dailyStatValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  dailyStatLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
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
  viewAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Quick Log
  quickLogGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickLogItem: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickLogIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  quickLogLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Activity Timeline
  activityItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  activityLeft: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  activityContent: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  activityTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  activitySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activityUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  activityUserName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  activityRoleBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  activityRoleText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
