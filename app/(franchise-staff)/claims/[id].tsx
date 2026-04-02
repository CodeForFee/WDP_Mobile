import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '@/constants/theme';
import { LoadingSpinner, StatusBadge, Card } from '@/components/common';
import { useClaim } from '@/hooks/useClaim';

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
      return 'warning';
  }
};

export default function ClaimDetailScreen() {
  const { id } = useLocalSearchParams();
  const { useClaimDetail } = useClaim();
  const { data: claim, isLoading, isError } = useClaimDetail(id as string);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner size={40} />
      </SafeAreaView>
    );
  }

  if (isError || !claim) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>Không tìm thấy khiếu nại</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Claim Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã khiếu nại</Text>
            <Text style={styles.infoValue}>{claim.id.slice(0, 12)}...</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã lô hàng</Text>
            <Text style={styles.infoValue}>{claim.shipmentId.slice(0, 12)}...</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <StatusBadge status={claim.status} type={getStatusType(claim.status)} size="sm" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày tạo</Text>
            <Text style={styles.infoValue}>{formatDate(claim.createdAt)}</Text>
          </View>
          {claim.resolvedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày xử lý</Text>
              <Text style={styles.infoValue}>{formatDate(claim.resolvedAt)}</Text>
            </View>
          )}
        </Card>

        {/* Items */}
        <Text style={styles.sectionTitle}>Danh sách sản phẩm có vấn đề</Text>
        {claim.items?.map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.productName}</Text>
            <Text style={styles.itemSku}>SKU: {item.sku}</Text>

            <View style={styles.itemStats}>
              {item.quantityMissing > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="remove-circle-outline" size={16} color={COLORS.error} />
                  <Text style={styles.statText}>Thiếu: {item.quantityMissing}</Text>
                </View>
              )}
              {item.quantityDamaged > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="warning-outline" size={16} color={COLORS.error} />
                  <Text style={styles.statText}>Hỏng: {item.quantityDamaged}</Text>
                </View>
              )}
            </View>

            {item.reason && (
              <View style={styles.reasonSection}>
                <Text style={styles.reasonLabel}>Lý do:</Text>
                <Text style={styles.reasonText}>{item.reason}</Text>
              </View>
            )}

            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.md },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: 'bold', flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: SPACING.base, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  infoCard: { marginBottom: SPACING.lg, padding: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.fontSize.sm },
  infoValue: { fontWeight: '600', fontSize: TYPOGRAPHY.fontSize.sm },

  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold', marginBottom: SPACING.md },
  itemCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  itemName: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: 'bold', marginBottom: 4 },
  itemSku: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
  itemStats: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: COLORS.error, fontWeight: '600' },
  reasonSection: { marginTop: SPACING.sm, padding: SPACING.sm, backgroundColor: COLORS.backgroundTertiary, borderRadius: RADIUS.sm },
  reasonLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  reasonText: { fontSize: 12, color: COLORS.textPrimary, marginTop: 2 },
  itemImage: { width: '100%', height: 150, borderRadius: RADIUS.md, marginTop: SPACING.sm },
});
