import React from 'react';
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
import { Card, StatusBadge, Button, Header } from '../../../src/components/common';

const orderSummary = [
  { id: '1', name: 'Crispy Chicken Bucket', qty: '2x', note: '12 pieces + sides' },
  { id: '2', name: 'Spicy Wings', qty: '1x', note: 'Extra hot sauce' },
  { id: '3', name: 'Soft Drinks', qty: '3x', note: 'Large Cola, Sprite' },
];

export default function DispatchScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        title="Ready for Delivery"
        subtitle="Order #CK-4729"
        showBack
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, styles.contentAfterHeader]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
          </View>
          <Text style={styles.statusTitle}>Package Complete!</Text>
          <Text style={styles.statusSubtitle}>Order is packed and ready for pickup</Text>
        </Card>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <StatusBadge status="READY" type="completed" size="sm" />
          </View>

          <Card>
            {orderSummary.map((item, index) => (
              <View key={item.id} style={[
                styles.orderItem,
                index < orderSummary.length - 1 && styles.orderItemBorder
              ]}>
                <View style={styles.orderItemIcon}>
                  <Ionicons name="fast-food" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemNote}>{item.note}</Text>
                </View>
                <Text style={styles.orderItemQty}>{item.qty}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <Card>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Driver Assigned</Text>
                <Text style={styles.infoValue}>Marcus Chan • ADR-2847</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Pickup Time</Text>
                <Text style={styles.infoValue}>2:45 PM - 3:00 PM</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <Text style={styles.infoValue}>1207 Oak Street, Apt 4B</Text>
                <Text style={styles.infoSubvalue}>Downtown District</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.packageGrid}>
            <Card style={styles.packageCard}>
              <Ionicons name="scale" size={24} color={COLORS.primary} />
              <Text style={styles.packageValue}>2.8 kg</Text>
              <Text style={styles.packageLabel}>Total Weight</Text>
            </Card>
            <Card style={styles.packageCard}>
              <Ionicons name="cube" size={24} color={COLORS.primary} />
              <Text style={styles.packageValue}>3 bags</Text>
              <Text style={styles.packageLabel}>Package Count</Text>
            </Card>
          </View>
          <View style={styles.packageGrid}>
            <Card style={styles.packageCard}>
              <Ionicons name="thermometer" size={24} color={COLORS.success} />
              <Text style={[styles.packageValue, { color: COLORS.success }]}>Hot & Fresh</Text>
              <Text style={styles.packageLabel}>Temperature</Text>
            </Card>
            <Card style={styles.packageCard}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
              <Text style={[styles.packageValue, { color: COLORS.success }]}>Verified</Text>
              <Text style={styles.packageLabel}>Quality Check</Text>
            </Card>
          </View>
        </View>

        {/* Action Button */}
        <Button
          title="Notify Driver"
          icon="notifications"
          iconPosition="left"
          size="lg"
          fullWidth
          onPress={() => { }}
          style={styles.notifyButton}
        />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  // Status Card
  statusCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.successLight,
    marginBottom: SPACING.lg,
  },
  statusIcon: {
    marginBottom: SPACING.md,
  },
  statusTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.successDark,
    marginBottom: SPACING.xs,
  },
  statusSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
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
  // Order Item
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  orderItemNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  orderItemQty: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  infoSubvalue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  // Package Grid
  packageGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  packageCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: 0,
  },
  packageValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  packageLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Button
  notifyButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
});
