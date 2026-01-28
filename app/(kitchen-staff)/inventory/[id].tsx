import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Header, Card, StatusBadge, Button } from '../../../src/components/common';

// Mock Data
const INVENTORY_DETAILS = {
  '1': {
    id: '1',
    name: 'Flour (Premium)',
    totalQuantity: 2000,
    unit: 'kg',
    minThreshold: 500,
    batches: [
      { id: 'B-231020', quantity: 1500, expiry: '2024-04-20', status: 'Good' },
      { id: 'B-230915', quantity: 500, expiry: '2023-11-15', status: 'Good' },
    ]
  },
  '3': {
    id: '3',
    name: 'Milk (Whole)',
    totalQuantity: 50,
    unit: 'L',
    minThreshold: 100,
    batches: [
      { id: 'B-231022', quantity: 50, expiry: '2023-10-29', status: 'Expiring Soon' },
    ]
  }
};

export default function InventoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const item = INVENTORY_DETAILS['1'];

  const [adjustMode, setAdjustMode] = useState<'add' | 'remove' | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const handleAdjustStock = () => {
    if (!adjustAmount || isNaN(Number(adjustAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }

    const amount = Number(adjustAmount);
    const action = adjustMode === 'add' ? 'Added' : 'Removed';

    Alert.alert(
      'Confirm Adjustment',
      `Are you sure you want to ${adjustMode} ${amount} ${item.unit}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log(`${action} ${amount} to ${item.name}`);
            setAdjustMode(null);
            setAdjustAmount('');
            Alert.alert('Success', 'Stock updated successfully');
          }
        }
      ]
    );
  };

  const renderBatch = ({ item: batch }: any) => (
    <View style={styles.batchCard}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchId}>{batch.id}</Text>
        <StatusBadge status={batch.status} type={batch.status === 'Good' ? 'success' : 'warning'} size="sm" />
      </View>
      <View style={styles.batchDetails}>
        <Text style={styles.batchText}>Qty: {batch.quantity} {item.unit}</Text>
        <Text style={styles.batchText}>Exp: {batch.expiry}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Inventory Details"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Info */}
        <Card style={styles.mainCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.totalQuantity}>{item.totalQuantity}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
          <Text style={styles.thresholdText}>Min Threshold: {item.minThreshold} {item.unit}</Text>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => setAdjustMode('add')}
          >
            <Ionicons name="add-circle-outline" size={24} color={COLORS.textLight} />
            <Text style={styles.actionBtnText}>Add Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => setAdjustMode('remove')}
          >
            <Ionicons name="remove-circle-outline" size={24} color={COLORS.textLight} />
            <Text style={styles.actionBtnText}>Remove Stock</Text>
          </TouchableOpacity>
        </View>

        {/* Adjustment Modal (Inline) */}
        {adjustMode && (
          <View style={styles.adjustContainer}>
            <Text style={styles.adjustTitle}>
              {adjustMode === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={adjustAmount}
                onChangeText={setAdjustAmount}
                autoFocus
                placeholderTextColor={COLORS.textMuted}
                cursorColor={COLORS.primary}
              />
              <Text style={styles.inputUnit}>{item.unit}</Text>
            </View>
            <View style={styles.adjustActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setAdjustMode(null);
                  setAdjustAmount('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAdjustStock}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Batches List */}
        <Text style={styles.sectionTitle}>Active Batches</Text>
        <FlatList
          data={item.batches}
          renderItem={renderBatch}
          keyExtractor={batch => batch.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
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
  content: {
    padding: SPACING.base,
  },
  mainCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    ...SHADOWS.md,
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  totalQuantity: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary, // Using theme Primary Yellow
  },
  unit: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  thresholdText: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  addButton: {
    backgroundColor: COLORS.success, // Green
  },
  removeButton: {
    backgroundColor: COLORS.error, // Red
  },
  actionBtnText: {
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  batchCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  batchId: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
  },
  batchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  batchText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  adjustContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary, // Highlight adjust modal
    ...SHADOWS.md,
  },
  adjustTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
  },
  inputUnit: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  adjustActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.backgroundTertiary,
  },
  confirmBtn: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
  },
  confirmText: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textOnPrimary, // Ensure contrast
  },
});
