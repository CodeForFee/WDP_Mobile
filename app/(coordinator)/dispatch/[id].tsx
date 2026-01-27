import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

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
  const task = DISPATCH_DETAILS[id as string] || DISPATCH_DETAILS['DP-001'];
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

  const renderVehicle = ({ item }) => {
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
              color={isSelected ? '#007AFF' : '#555'}
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
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Vehicle</Text>
        <View style={{ width: 24 }} />
      </View>

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

        <TouchableOpacity
          style={[styles.confirmButton, !selectedVehicle && styles.disabledButton]}
          onPress={handleAssign}
          disabled={!selectedVehicle}
        >
          <Text style={styles.confirmButtonText}>Confirm Assignment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#343a40',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryDest: {
    color: '#ced4da',
    fontSize: 14,
    marginBottom: 10,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryText: {
    color: '#adb5bd',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehicleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bgAvailable: { backgroundColor: '#d4edda' },
  bgBusy: { backgroundColor: '#f8d7da' },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  driverRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  driverLabel: {
    color: '#666',
    width: 70,
  },
  driverName: {
    fontWeight: '500',
    color: '#333',
  },
  capacityRow: {
    flexDirection: 'row',
  },
  capacityLabel: {
    color: '#666',
    width: 70,
  },
  capacityValue: {
    fontWeight: '500',
    color: '#333',
  },
  checkIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
