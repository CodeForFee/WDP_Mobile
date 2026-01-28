import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../../src/constants/theme';
import { Card, StatusBadge, Header } from '../../../src/components/common';

// Mock Data
const SHIPMENTS = [
  {
    id: 'CK-4729',
    destination: 'Store #123 - North District',
    items: 45,
    status: 'Ready',
    vehicle: null,
    time: '2:30 PM',
  },
  {
    id: 'CK-4730',
    destination: 'Store #124 - South District',
    items: 32,
    status: 'In Transit',
    vehicle: 'Truck 29C-123.45',
    time: '3:00 PM',
    progress: 0.65,
  },
  {
    id: 'CK-4728',
    destination: 'Store #125 - West District',
    items: 18,
    status: 'Delivered',
    vehicle: 'Van 29D-567.89',
    time: '1:15 PM',
  },
  {
    id: 'CK-4731',
    destination: 'Store #126 - East District',
    items: 60,
    status: 'Pending',
    vehicle: null,
    time: '4:00 PM',
  },
];

type FilterTab = 'All' | 'Pending' | 'In Transit' | 'Delivered';

export default function DispatchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filteredData = SHIPMENTS.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return item.status === 'Pending' || item.status === 'Ready';
    return item.status === activeTab;
  });

  const getStatusType = (status: string) => {
    switch (status) {
      case 'Delivered': return 'completed';
      case 'In Transit': return 'info';
      case 'Ready': return 'success';
      default: return 'warning';
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'In Transit': return 'navigate-circle';
      case 'Ready': return 'cube';
      default: return 'time';
    }
  };

  const renderItem = ({ item }: { item: typeof SHIPMENTS[0] }) => (
    <Card
      style={styles.card}
      onPress={() => router.push(`/(coordinator)/dispatch/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.idRow}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.backgroundSecondary }]}>
            <Ionicons name={getIcon(item.status) as any} size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.idText}>Order #{item.id}</Text>
            <Text style={styles.timeText}>Est: {item.time}</Text>
          </View>
        </View>
        <StatusBadge status={item.status} type={getStatusType(item.status) as any} size="sm" />
      </View>

      <Text style={styles.destText} numberOfLines={1}>{item.destination}</Text>

      <View style={styles.footer}>
        <Text style={styles.itemsText}>{item.items} items</Text>
        {item.vehicle ? (
          <View style={styles.vehicleRow}>
            <Ionicons name="bus-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.vehicleText}>{item.vehicle}</Text>
          </View>
        ) : (
          <Text style={styles.assignText}>Tap to Assign</Text>
        )}
      </View>

      {item.status === 'In Transit' && (
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(item.progress || 0) * 100}%` }]} />
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Dispatch Management"
        // subtitle="Logistics Overview"
        rightElement={
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {(['All', 'Pending', 'In Transit', 'Delivered'] as FilterTab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabsContainer: {
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  tabsContent: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  activeTabText: {
    color: COLORS.textLight,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: 100, // Space for bottom bar
  },
  card: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  idRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  destText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    paddingLeft: 48 + SPACING.sm, // Align with text id
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  itemsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  assignText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
});
