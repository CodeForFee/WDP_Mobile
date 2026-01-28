import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Card, StatusBadge, Header } from '../../../src/components/common';

const timeSlots = ['09:00', '10:00', '11:00', '12:00'];

const productionItems = [
  { id: '1', time: '0:04', name: 'Morning Prep - Original Recipe', status: 'Completed' },
  { id: '2', time: '10:00', name: 'Spicy Wings Batch', items: 'Batch 5 • 80 pieces', status: 'In Progress' },
  { id: '3', time: '11:00', name: 'Hot n Spicy Batch', items: '', status: 'Pending' },
];

const todayBatches = [
  { id: 'BCH001', name: 'Original Recipe', count: 120, status: 'Completed' },
  { id: 'BCH002', name: 'Crispy Tenders', count: 300, time: '09:00', status: 'Cooking' },
  { id: 'BCH003', name: 'Crispy Tenders', count: 400, time: '11:00', status: 'Pending' },
];

export default function ProductionPlanScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('Jan 31');

  return (
    <View style={styles.container}>
      <Header
        title="Production Plan"
      // subtitle="Central Kitchen"
      // rightElement={
      //   <TouchableOpacity style={styles.datePickerButton}>
      //     <Text style={styles.datePickerText}>{selectedDate}</Text>
      //     <Ionicons name="calendar" size={16} color={COLORS.primary} />
      //   </TouchableOpacity>
      // }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, styles.contentAfterHeader]}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>

          <View style={styles.timeSlotRow}>
            {timeSlots.map((time) => (
              <TouchableOpacity key={time} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.scheduleStats}>
            <View style={[styles.scheduleStatItem, { backgroundColor: COLORS.successLight }]}>
              <Text style={[styles.scheduleStatValue, { color: COLORS.success }]}>12</Text>
              <Text style={styles.scheduleStatLabel}>Active Tasks</Text>
            </View>
            <View style={[styles.scheduleStatItem, { backgroundColor: COLORS.warningLight }]}>
              <Text style={[styles.scheduleStatValue, { color: COLORS.warningDark }]}>8</Text>
              <Text style={styles.scheduleStatLabel}>Scheduled</Text>
            </View>
            <View style={[styles.scheduleStatItem, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={[styles.scheduleStatValue, { color: COLORS.primary }]}>14:00</Text>
              <Text style={styles.scheduleStatLabel}>Delayed</Text>
            </View>
          </View>
        </View>

        {/* Production Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Production Timeline</Text>

          {productionItems.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                {item.status === 'Completed' && (
                  <Ionicons name="checkmark" size={12} color={COLORS.textLight} />
                )}
              </View>
              {index < productionItems.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>{item.time}</Text>
                <Text style={styles.timelineName}>{item.name}</Text>
                {item.items && <Text style={styles.timelineItems}>{item.items}</Text>}
              </View>
              <StatusBadge
                status={item.status}
                size="sm"
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addTaskButton}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
            <Text style={styles.addTaskText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Batches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Batches</Text>

          {todayBatches.map((batch) => (
            <Card
              key={batch.id}
              style={styles.batchCard}
              onPress={() => router.push(`/(kitchen-staff)/production/${batch.id}`)}
            >
              <View style={styles.batchHeader}>
                <StatusBadge
                  status={batch.status}
                  size="sm"
                />
                <Text style={styles.batchId}>{batch.id}</Text>
              </View>
              <Text style={styles.batchName}>{batch.name}</Text>
              <View style={styles.batchFooter}>
                <Text style={styles.batchCount}>{batch.count} pcs</Text>
                {batch.time && <Text style={styles.batchTime}>{batch.time}</Text>}
              </View>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Detail</Text>
              </TouchableOpacity>
            </Card>
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
  // Content spacing after header
  contentAfterHeader: {
    paddingTop: SPACING.md,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  datePickerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  // Section
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  // Time Slots
  timeSlotRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeSlotText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  scheduleStats: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  scheduleStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  scheduleStatValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  scheduleStatLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Timeline
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    width: 2,
    height: 50,
    backgroundColor: COLORS.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  timelineName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  timelineItems: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  addTaskText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Batch Card
  batchCard: {
    marginBottom: SPACING.md,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  batchId: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  batchName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  batchFooter: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  batchCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  batchTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  viewDetailsButton: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  viewDetailsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
