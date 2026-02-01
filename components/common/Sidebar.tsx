import React, { use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAuthContext } from '@/lib/authContext';
import { useSessionStore } from '@/stores/storeSession';

interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: string;
}

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  userRole?: 'franchise-staff' | 'kitchen-staff' | 'coordinator';
  userName?: string;
  userInfo?: string;
}

// Menu items for Franchise Staff
const franchiseMenuItems: SidebarItem[] = [
  {
    id: 'receiving',
    label: 'Nhận hàng',
    icon: 'download-outline',
    route: '/(franchise-staff)/receiving',
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    icon: 'person-outline',
    route: '/(franchise-staff)/profile',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'settings-outline',
    route: '/(franchise-staff)/profile',
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: 'help-circle-outline',
    route: '/(franchise-staff)/profile',
  },
];

// Menu items for Kitchen Staff
const kitchenMenuItems: SidebarItem[] = [
  {
    id: 'profile',
    label: 'Hồ sơ',
    icon: 'person-outline',
    route: '/(kitchen-staff)/profile',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'settings-outline',
    route: '/(kitchen-staff)/profile',
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: 'help-circle-outline',
    route: '/(kitchen-staff)/profile',
  },
];

// Menu items for Coordinator
const coordinatorMenuItems: SidebarItem[] = [
  {
    id: 'issues',
    label: 'Xử lý vấn đề',
    icon: 'alert-circle-outline',
    route: '/(coordinator)/issues',
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    icon: 'person-outline',
    route: '/(coordinator)/profile',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'settings-outline',
    route: '/(coordinator)/profile',
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: 'help-circle-outline',
    route: '/(coordinator)/profile',
  },
];

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'franchise-staff':
      return 'Franchise Staff';
    case 'kitchen-staff':
      return 'Central Kitchen Staff';
    case 'coordinator':
      return 'Supply Coordinator';
    default:
      return 'Staff';
  }
};

const getMenuItems = (role: string): SidebarItem[] => {
  switch (role) {
    case 'franchise-staff':
      return franchiseMenuItems;
    case 'kitchen-staff':
      return kitchenMenuItems;
    case 'coordinator':
      return coordinatorMenuItems;
    default:
      return franchiseMenuItems;
  }
};

export function Sidebar({
  visible,
  onClose,
  userRole = 'franchise-staff',
  userName = 'John Smith',
  userInfo = 'Store #247 • Downtown Plaza',
}: SidebarProps) {
  const router = useRouter();
  // Start from right side (positive value)
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const { logout } = useAuthContext();
  const session = useSessionStore()
  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const menuItems = getMenuItems(userRole);
  const roleLabel = getRoleLabel(userRole);

  const handleItemPress = (item: SidebarItem) => {
    onClose();
    setTimeout(() => {
      router.push(item.route as any);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sidebar - slides from right */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={COLORS.primary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{session.user ? session.user.email : userName}</Text>
                <Text style={styles.userRole}>{session.user ? session.user.role : roleLabel}</Text>
                <Text style={styles.storeInfo}>{session.user ? session.user.storeId : userInfo}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Additional Actions */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
                </View>
                <Text style={[styles.menuLabel, { color: COLORS.error }]}>Đăng xuất</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    height: '100%',
    backgroundColor: COLORS.cardBackground,
    ...SHADOWS.xl,
  },
  header: {
    paddingTop: SPACING.xl + 20,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: 2,
  },
  storeInfo: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.xl + 20,
    right: SPACING.base,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.sm,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textLight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  footer: {
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  versionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
});
