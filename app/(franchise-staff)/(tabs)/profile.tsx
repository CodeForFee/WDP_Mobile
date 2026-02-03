import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, LoadingSpinner } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useSessionStore } from '@/stores/storeSession';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/type';
import { handleErrorApi } from '@/lib/errors';
import { useAuthContext } from '@/contexts/authContext';

const menuItems = [
  { id: '1', icon: 'person-outline', label: 'Account Settings', route: '' },
  { id: '2', icon: 'notifications-outline', label: 'Notifications', route: '' },
  { id: '3', icon: 'lock-closed-outline', label: 'Privacy & Security', route: '' },
  { id: '4', icon: 'help-circle-outline', label: 'Help & Support', route: '' },
  { id: '5', icon: 'information-circle-outline', label: 'About', route: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const session = useSessionStore();
  const { logout: logoutContext } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userData = await useAuth.me();
      setUser(userData);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutContext();
  };

  // Get display name: username or email fallback
  const displayName = user?.username || session.user?.email || 'User';
  const displayRole = user?.role || session.user?.role || 'Staff';
  const displayStore = session.user?.storeId ? `Store #${session.user.storeId}` : '';

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={48} color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={COLORS.textMuted} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>{displayRole}</Text>
          {displayStore && (
            <Text style={styles.store}>{displayStore}</Text>
          )}
          {user?.email && (
            <Text style={styles.email}>{user.email}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Orders Today</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="outline"
          icon="log-out-outline"
          iconPosition="left"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
        />

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingTop: SPACING['3xl'],
    paddingBottom: 120,
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  role: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.xs,
  },
  store: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: 0,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Menu
  menuSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuItemLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Logout
  logoutButton: {
    marginBottom: SPACING.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
});
