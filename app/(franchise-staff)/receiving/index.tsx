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
import { Card, StatusBadge, Button, Header } from '../../../src/components/common';

const checklistItems = [
  { id: '1', title: 'Temperature Check', desc: 'Verify all frozen items are below 0°F', icon: 'thermometer', status: 'pending' },
  { id: '2', title: 'Package Integrity', desc: 'Check for damaged or torn packaging', icon: 'cube', status: 'pending' },
  { id: '3', title: 'Expiration Dates', desc: 'Verify all products are within shelf life', icon: 'calendar', status: 'pending' },
  { id: '4', title: 'Quantity Verification', desc: 'Count and verify all items match order', icon: 'list', status: 'pending' },
];

export default function ReceiveGoodsScreen() {
  const router = useRouter();
  const [checklist, setChecklist] = useState(checklistItems);
  const [isScanning, setIsScanning] = useState(false);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'checked' ? 'pending' : 'checked' }
        : item
    ));
  };

  const completedCount = checklist.filter(item => item.status === 'checked').length;

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, styles.contentAfterHeader]}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Scanner Card */}
        <Card style={styles.scannerCard}>
          <View style={styles.scannerIcon}>
            <Ionicons name="qr-code" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.scannerTitle}>Scan Delivery QR</Text>
          <Text style={styles.scannerSubtext}>Position the QR code within the frame</Text>

          <View style={styles.scannerFrame}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={48} color={COLORS.textMuted} />
            </View>
          </View>

          <Button
            title="Start Scanning"
            icon="scan"
            onPress={() => setIsScanning(true)}
            fullWidth
            style={styles.scanButton}
          />
        </Card>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <Card>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Supplier</Text>
              <Text style={styles.infoValue}>Fresh Poultry Co.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expected Time</Text>
              <Text style={styles.infoValue}>2:30 PM</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Items</Text>
              <Text style={styles.infoValue}>12 Products</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <StatusBadge status="Pending" type="pending" size="sm" />
            </View>
          </Card>
        </View>

        {/* Inspection Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inspection Checklist</Text>
            <Text style={styles.completedCount}>{completedCount}/{checklist.length} Complete</Text>
          </View>

          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checklistItem}
              onPress={() => toggleCheck(item.id)}
            >
              <View style={[
                styles.checkbox,
                item.status === 'checked' && styles.checkboxChecked
              ]}>
                {item.status === 'checked' && (
                  <Ionicons name="checkmark" size={16} color={COLORS.textLight} />
                )}
              </View>
              <View style={styles.checklistContent}>
                <View style={styles.checklistTitleRow}>
                  <Text style={[
                    styles.checklistTitle,
                    item.status === 'checked' && styles.checklistTitleChecked
                  ]}>
                    {item.title}
                  </Text>
                  <View style={[
                    styles.statusDot,
                    item.status === 'checked'
                      ? { backgroundColor: COLORS.success }
                      : { backgroundColor: COLORS.warning }
                  ]} />
                </View>
                <Text style={styles.checklistDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Report Issue"
            variant="outline"
            onPress={() => { }}
            style={styles.actionButton}
          />
          <Button
            title="Accept Delivery"
            onPress={() => { }}
            style={styles.actionButton}
            disabled={completedCount < checklist.length}
          />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  // Scanner Card
  scannerCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  scannerIcon: {
    marginBottom: SPACING.md,
  },
  scannerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  scannerSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  scannerFrame: {
    width: '80%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    borderStyle: 'dashed',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    width: '80%',
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
  completedCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  // Checklist
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  checklistTitleChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  checklistDesc: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
});
