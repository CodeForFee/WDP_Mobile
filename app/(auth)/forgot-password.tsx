import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { EmailInput, ResetPasswordInput, emailSchema, resetPasswordSchema } from '@/schemas/authSchema';
import { COLORS, SPACING, TYPOGRAPHY, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleErrorApi } from '@/lib/errors';
import { Input, Button } from '@/components/common';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Form for Step 1 - Email
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    setError: setEmailError,
    formState: { errors: emailErrors },
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form for Step 2 - Reset Password
  const {
    control: resetControl,
    handleSubmit: handleResetSubmit,
    setError: setResetError,
    formState: { errors: resetErrors },
    reset: resetForm,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSendEmail = async (values: EmailInput) => {
    setLoading(true);
    try {
      const res = await useAuth.forgotPassword(values.email);
      setEmail(values.email);
      Alert.alert(res.message);
      setStep(2);
    } catch (error) {
      handleErrorApi({ error, setError: setEmailError });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordInput) => {
    setLoading(true);
    try {
      const req: ResetPasswordInput = {
        ...values,
        email: email
      }
      const res = await useAuth.resetPassword(req);
      Alert.alert('Thành công', res.message);
      router.replace('/(auth)/login');
    } catch (error) {

      handleErrorApi({ error, setError: setResetError });
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (step === 1) {
                  router.back();
                } else {
                  setStep(1);
                  resetForm();
                }
              }}
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

                <Controller
                  control={emailControl}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      icon="mail-outline"
                      placeholder="Nhập email của bạn"
                      value={value}
                      onChangeText={onChange}
                      error={emailErrors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                      variant="filled"
                    />
                  )}
                />

                <Button
                  title="Gửi mã xác nhận"
                  onPress={handleEmailSubmit(handleSendEmail)}
                  disabled={loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon="send-outline"
                />
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
                <Controller
                  control={resetControl}
                  name="code"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      icon="key-outline"
                      placeholder="Nhập mã xác nhận (6 ký tự)"
                      value={value}
                      onChangeText={onChange}
                      error={resetErrors.code?.message}
                      maxLength={6}
                      autoCapitalize="none"
                      editable={!loading}
                      variant="filled"
                    />
                  )}
                />

                {/* New Password Input */}
                <Controller
                  control={resetControl}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      icon="lock-closed-outline"
                      placeholder="Mật khẩu mới (6-32 ký tự)"
                      value={value}
                      onChangeText={onChange}
                      error={resetErrors.password?.message}
                      secureTextEntry
                      editable={!loading}
                      variant="filled"
                    />
                  )}
                />

                {/* Confirm Password Input */}
                <Controller
                  control={resetControl}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      icon="lock-closed-outline"
                      placeholder="Xác nhận mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      error={resetErrors.confirmPassword?.message}
                      secureTextEntry
                      editable={!loading}
                      variant="filled"
                    />
                  )}
                />

                <Button
                  title="Đặt lại mật khẩu"
                  onPress={handleResetSubmit(handleResetPassword)}
                  disabled={loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon="checkmark-circle-outline"
                />

                {/* Resend Code */}
                <View style={{ marginTop: SPACING.lg }}>
                  <Button
                    title="Gửi lại mã xác nhận"
                    onPress={() => {
                      setStep(1);
                      resetForm();
                    }}
                    disabled={loading}
                    variant="ghost"
                    size="md"
                    fullWidth
                    icon="refresh-outline"
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
});
