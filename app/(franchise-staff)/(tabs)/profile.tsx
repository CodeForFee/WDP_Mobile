import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useSessionStore } from '@/stores/storeSession';
import { useAuth } from '@/hooks/useAuth';
import { authRequest } from '@/apiRequest/auth';
import { uploadRequest } from '@/apiRequest/upload';
import { handleErrorApi } from '@/lib/errors';
import { useAuthContext } from '@/contexts/authContext';
import { QUERY_KEY } from '@/constant';

const menuItems = [
  { id: '1', icon: 'warning-outline', label: 'Khiếu nại', route: '/(franchise-staff)/claims' },
  { id: '2', icon: 'notifications-outline', label: 'Thông báo', route: '' },
  { id: '3', icon: 'lock-closed-outline', label: 'Bảo mật & Quyền riêng tư', route: '' },
  { id: '4', icon: 'help-circle-outline', label: 'Trợ giúp & Hỗ trợ', route: '' },
  { id: '5', icon: 'information-circle-outline', label: 'Về ứng dụng', route: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSessionStore();
  const { logout: logoutContext } = useAuthContext();
  const { useMe } = useAuth();
  const { data: user, isLoading } = useMe();

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', email: '' });

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
      });
    }
  }, [user]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập ảnh');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  };

  const handleChangeAvatar = async () => {
    const uri = await pickImage();
    if (!uri) return;

    setLoadingUpload(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      const uploadResult = await uploadRequest.uploadImage(formData);
      const avatarUrl = typeof uploadResult === 'string' ? uploadResult : (uploadResult as { url?: string }).url;
      if (!avatarUrl) throw new Error('Upload failed');
      await authRequest.updateProfile({ avatar: avatarUrl } as any);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.auth.me() });
      Alert.alert('Thành công', 'Đổi ảnh đại diện thành công');
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logoutContext();
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    setLoadingUpdate(true);
    try {
      await authRequest.updateProfile({
        fullName: editForm.fullName || undefined,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.auth.me() });
      setShowEditModal(false);
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công');
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Get display name: fullName > username > email
  const displayName = user?.fullName || user?.username || session.user?.email || 'User';
  const displayRole = user?.role || session.user?.role || 'Staff';
  const displayStore = session.user?.storeId ? `Cửa hàng #${session.user.storeId}` : '';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={48} color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={handleChangeAvatar}
              disabled={loadingUpload}
            >
              {loadingUpload ? (
                <LoadingSpinner size={24} color={COLORS.primary} />
              ) : user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChangeAvatar}
              disabled={loadingUpload}
            >
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
          {user?.phone && (
            <Text style={styles.phone}>{user.phone}</Text>
          )}

          <Button
            title="Chỉnh sửa hồ sơ"
            variant="outline"
            size="sm"
            icon="create-outline"
            onPress={() => setShowEditModal(true)}
            style={styles.editButton}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.route ? router.push(item.route as any) : Alert.alert('Thông báo', 'Chức năng đang phát triển')}
            >
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
          title="Đăng xuất"
          variant="outline"
          icon="log-out-outline"
          iconPosition="left"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
        />

        <Text style={styles.version}>Phiên bản 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa hồ sơ</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.fullName}
                  onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                  placeholder="Nhập email"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Hủy"
                variant="outline"
                onPress={() => setShowEditModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Lưu"
                onPress={handleSaveProfile}
                loading={loadingUpdate}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.base,
    paddingTop: SPACING.md,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
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
  phone: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  editButton: {
    marginTop: SPACING.md,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalForm: {
    padding: SPACING.base,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    flex: 1,
  },
});
