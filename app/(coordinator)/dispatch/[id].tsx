import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Header, Button } from '../../../src/components/common';

// Mock Data
const DISPATCH_DETAILS = {
  'DP-001': {
    id: 'DP-001',
    destination: 'Route A (Stores 123, 124)',
    items: 45,
    weight: '120 kg',
    type: 'Morning Delivery'
  }
};

const AVAILABLE_VEHICLES = [
  { id: 'v1', name: 'Truck 29C-123.45', driver: 'Nguyen Van A', capacity: '2000 kg', status: 'Available' },
  { id: 'v2', name: 'Van 29D-567.89', driver: 'Tran Van B', capacity: '800 kg', status: 'Available' },
  { id: 'v3', name: 'Truck 29H-999.88', driver: 'Le Van C', capacity: '2000 kg', status: 'Busy' },
];

export default function DispatchAssignmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const task = DISPATCH_DETAILS['DP-001'];
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const handleAssign = () => {
    if (!selectedVehicle) {
      Alert.alert('Selection Required', 'Please select a vehicle to assign.');
      return;
    }

    Alert.alert(
      'Confirm Assignment',
      `Assign ${task.id} to vehicle?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log(`Assigned task ${task.id} to vehicle ${selectedVehicle}`);
            router.back();
          }
        }
      ]
    );
  };

  const renderVehicle = ({ item }: any) => {
    const isSelected = selectedVehicle === item.id;
    const isAvailable = item.status === 'Available';

    return (
      <TouchableOpacity
        style={[
          styles.vehicleCard,
          isSelected && styles.selectedCard,
          !isAvailable && styles.disabledCard
        ]}
        onPress={() => isAvailable && setSelectedVehicle(item.id)}
        disabled={!isAvailable}
      >
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIconRow}>
            <Ionicons
              name={item.name.includes('Truck') ? 'bus' : 'car'}
              size={24}
              color={isSelected ? COLORS.primary : '#555'}
            />
            <Text style={[styles.vehicleName, isSelected && styles.selectedText]}>{item.name}</Text>
          </View>
          <View style={[styles.statusBadge, isAvailable ? styles.bgAvailable : styles.bgBusy]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.driverRow}>
          <Text style={styles.driverLabel}>Driver:</Text>
          <Text style={styles.driverName}>{item.driver}</Text>
        </View>

        <View style={styles.capacityRow}>
          <Text style={styles.capacityLabel}>Capacity:</Text>
          <Text style={styles.capacityValue}>{item.capacity}</Text>
        </View>

        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Assign Vehicle"
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        {/* Task Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Task: {task.id}</Text>
          <Text style={styles.summaryDest}>{task.destination}</Text>
          <View style={styles.summaryMeta}>
            <Text style={styles.summaryText}>{task.items} items</Text>
            <Text style={styles.summaryText}>•</Text>
            <Text style={styles.summaryText}>{task.weight}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Vehicle</Text>

        <FlatList
          data={AVAILABLE_VEHICLES}
          renderItem={renderVehicle}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Button
          title="Confirm Assignment"
          onPress={handleAssign}
          disabled={!selectedVehicle}
          fullWidth
          size="lg"
          style={styles.confirmButton}
        />
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
    backgroundColor: '#343a40', // Keep dark for contrast or use primaryDark? user showed dark card.
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    color: 'white',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  summaryDest: {
    color: '#ced4da',
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  summaryText: {
    color: '#adb5bd',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
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
  vehicleCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundSecondary,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: COLORS.background,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  vehicleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  vehicleName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  selectedText: {
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  bgAvailable: { backgroundColor: COLORS.successLight },
  bgBusy: { backgroundColor: COLORS.errorLight },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  driverRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  driverLabel: {
    color: COLORS.textSecondary,
    width: 70,
  },
  driverName: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  capacityRow: {
    flexDirection: 'row',
  },
  capacityLabel: {
    color: COLORS.textSecondary,
    width: 70,
  },
  capacityValue: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  checkIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  confirmButton: {
    marginTop: SPACING.sm,
  }
});
