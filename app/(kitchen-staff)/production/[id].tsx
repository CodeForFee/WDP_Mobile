import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';

// Mock Data
const PRODUCTION_DETAILS = {
  '1': {
    id: '1',
    item: 'Burger Buns',
    quantity: 500,
    unit: 'pcs',
    progress: 80, // percentage
    status: 'In Progress',
    recipe: [
      { id: 'r1', name: 'Flour', amount: '200 kg', status: 'Added' },
      { id: 'r2', name: 'Yeast', amount: '5 kg', status: 'Added' },
      { id: 'r3', name: 'Water', amount: '120 L', status: 'Pending' },
    ],
    logs: [
      { time: '06:30', message: 'Production started' },
      { time: '07:15', message: 'Dough mixing completed' },
    ]
  }
};

export default function ProductionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const task = PRODUCTION_DETAILS[id as string] || PRODUCTION_DETAILS['1'];

  const [currentProgress, setCurrentProgress] = useState(task.progress);

  const handleUpdateProgress = () => {
    Alert.prompt(
      'Update Progress',
      'Enter new percentage (0-100)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (val) => {
            const num = Number(val);
            if (!isNaN(num) && num >= 0 && num <= 100) {
              setCurrentProgress(num);
            }
          }
        }
      ],
      'plain-text',
      currentProgress.toString()
    );
  };

  const handleComplete = () => {
    Alert.alert('Confirm Completion', 'Mark this production task as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Production Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Info */}
        <Card>
          <View style={styles.mainHeader}>
            <Text style={styles.itemName}>{task.item}</Text>
            <StatusBadge status={currentProgress === 100 ? 'Completed' : task.status} />
          </View>

          <Text style={styles.targetText}>Target: {task.quantity} {task.unit}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${currentProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{currentProgress}%</Text>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProgress}>
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        </Card>

        {/* Recipe / Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients & Steps</Text>
        {task.recipe.map((step, index) => (
          <Card key={step.id} style={styles.stepCard}>
            <View style={styles.stepRow}>
              <View style={styles.stepInfo}>
                <Text style={styles.stepName}>{index + 1}. {step.name}</Text>
                <Text style={styles.stepAmount}>{step.amount}</Text>
              </View>
              <Ionicons
                name={step.status === 'Added' ? "checkbox" : "square-outline"}
                size={24}
                color={step.status === 'Added' ? "#007AFF" : "#ccc"}
              />
            </View>
          </Card>
        ))}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.completeButton, currentProgress < 100 && styles.disabledButton]}
          onPress={handleComplete}
          disabled={currentProgress < 100}
        >
          <Text style={styles.completeButtonText}>Finish Production</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  targetText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  updateButton: {
    padding: 12,
    backgroundColor: '#fff0d4',
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  stepCard: {
    marginBottom: 10,
    padding: 15,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stepAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
