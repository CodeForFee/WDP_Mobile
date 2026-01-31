import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordInput } from '@/schemas/authSchema';
import { COLORS, SPACING, TYPOGRAPHY, SIZES } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Send Email, 2: Reset Password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      const success = await useAuth.forgotPassword(email);
      if (success) {
        Alert.alert(
          'Thành công',
          'Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        Alert.alert('Lỗi', 'Không thể gửi email. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (resetCode.length !== 6) {
      Alert.alert('Lỗi', 'Mã xác nhận phải có 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 32) {
      Alert.alert('Lỗi', 'Mật khẩu phải có từ 6-32 ký tự');
      return;
    }

    setLoading(true);
    try {
      const resetPasswordInput: ResetPasswordInput = {
        email,
        code: resetCode,
        password: newPassword,
        confirmPassword: confirmPassword,
      };

      const success = await useAuth.resetPassword(resetPasswordInput);
      if (success) {
        Alert.alert(
          'Thành công',
          'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      } else {
        Alert.alert('Lỗi', 'Mã xác nhận không đúng hoặc đã hết hạn');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (step === 1 ? router.back() : setStep(1))}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quên mật khẩu</Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, step >= 1 && styles.stepNumberActive]}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Xác nhận Email</Text>
          </View>
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, step >= 2 && styles.stepNumberActive]}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Đặt lại mật khẩu</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {step === 1 ? (
            // Step 1: Send Email
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={64} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Nhập Email của bạn</Text>
              <Text style={styles.description}>
                Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu đến email của bạn
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSendEmail}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Step 2: Reset Password
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={64} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Đặt lại mật khẩu</Text>
              <Text style={styles.description}>
                Nhập mã xác nhận đã được gửi đến email {email}
              </Text>

              {/* Reset Code Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mã xác nhận (6 ký tự)"
                  placeholderTextColor={COLORS.textMuted}
                  value={resetCode}
                  onChangeText={setResetCode}
                  maxLength={6}
                  keyboardType="number-pad"
                  editable={!loading}
                />
              </View>

              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu mới (6-32 ký tự)"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Text>
              </TouchableOpacity>

              {/* Resend Code */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setStep(1);
                  setResetCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.resendButtonText}>Gửi lại mã xác nhận</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    color: COLORS.textMuted,
  },
  stepNumberActive: {
    color: COLORS.textPrimary,
  },
  stepLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 100,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.xs,
    marginBottom: 24,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  stepContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.backgroundTertiary,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.textPrimary,
  },
  resendButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    textDecorationLine: 'underline',
  },
});
