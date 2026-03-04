import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';
import { Card, StatusBadge, LoadingSpinner } from '@/components/common';
import { useClaim } from '@/hooks/useClaim';
import { Claim } from '@/type';
import { handleErrorApi } from '@/lib/errors';

const getStatusType = (status: string): 'pending' | 'success' | 'error' | 'warning' => {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'approved':
    case 'resolved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'pending';
  }
};

export default function ClaimsListScreen() {
  const router = useRouter();
  const claimApi = useClaim;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      const res = await claimApi.getMyStoreClaims({});
      const data = (res as any)?.items || res;
      setClaims(Array.isArray(data) ? data : []);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [claimApi]);

  useFocusEffect(
    useCallback(() => {
      fetchClaims();
    }, [fetchClaims])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClaims();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderClaimItem = ({ item }: { item: Claim }) => {
    const totalIssues = item.items?.reduce((sum, i) => sum + (i.quantityMissing || 0) + (i.quantityDamaged || 0), 0) || 0;

    return (
      <Card
        style={styles.claimCard}
        onPress={() => router.push(`/(franchise-staff)/claims/${item.id}` as any)}
      >
        <View style={styles.claimHeader}>
          <View style={styles.claimIconWrap}>
            <Ionicons name="warning-outline" size={20} color={COLORS.error} />
          </View>
          <View style={styles.claimInfo}>
            <Text style={styles.claimId}>Mã: {item.id.slice(0, 8)}...</Text>
            <StatusBadge
              status={item.status}
              type={getStatusType(item.status)}
              size="sm"
            />
          </View>
        </View>
        <View style={styles.claimMeta}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.claimDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.claimSummary}>
          <Text style={styles.claimSummaryText}>
            {totalIssues} sản phẩm có vấn đề
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
        </View>
      ) : claims.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="warning-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Chưa có khiếu nại nào</Text>
        </View>
      ) : (
        <FlatList
          data={claims}
          renderItem={renderClaimItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  emptyText: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.md },
  listContent: { padding: SPACING.base, paddingBottom: 100 },

  claimCard: { marginBottom: SPACING.md, padding: SPACING.md },
  claimHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  claimIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  claimInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  claimId: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold' },
  claimMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  claimDate: { fontSize: 12, color: COLORS.textMuted },
  claimSummary: { marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  claimSummaryText: { fontSize: 12, color: COLORS.error, fontWeight: '600' },
});
