import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

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
  const item = INVENTORY_DETAILS[id as string] || INVENTORY_DETAILS['1'];

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

  const renderBatch = ({ item: batch }) => (
    <View style={styles.batchCard}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchId}>{batch.id}</Text>
        <View style={[styles.statusBadge, batch.status === 'Good' ? styles.bgGood : styles.bgWarning]}>
          <Text style={styles.statusText}>{batch.status}</Text>
        </View>
      </View>
      <View style={styles.batchDetails}>
        <Text style={styles.batchText}>Qty: {batch.quantity} {item.unit}</Text>
        <Text style={styles.batchText}>Exp: {batch.expiry}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Main Info */}
        <View style={styles.mainCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.totalQuantity}>{item.totalQuantity}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
          <Text style={styles.thresholdText}>Min Threshold: {item.minThreshold} {item.unit}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => setAdjustMode('add')}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.actionBtnText}>Add Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => setAdjustMode('remove')}
          >
            <Ionicons name="remove-circle-outline" size={24} color="white" />
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
          contentContainerStyle={styles.listContent}
        />
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
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  totalQuantity: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  unit: {
    fontSize: 18,
    color: '#666',
  },
  thresholdText: {
    marginTop: 10,
    color: '#888',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  addButton: {
    backgroundColor: '#34C759',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  batchCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  batchId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bgGood: { backgroundColor: '#d4edda' },
  bgWarning: { backgroundColor: '#fff3cd' },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  batchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batchText: {
    color: '#666',
  },
  adjustContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adjustTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
  },
  inputUnit: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  adjustActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  confirmBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  cancelText: {
    fontWeight: 'bold',
    color: '#666',
  },
  confirmText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
