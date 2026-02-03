import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordInput, resetPasswordSchema } from '@/schemas/authSchema';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleErrorApi } from '@/lib/errors';
import { Input, Button } from '@/components/common';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Gộp 2 form thành 1 để giữ vững State của Input OTP
  const {
    control,
    handleSubmit,
    setError,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const emailValue = watch('email');

  // Xử lý gửi mã về Email
  const handleSendEmail = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    setLoading(true);
    try {
      const res = await useAuth.forgotPassword(emailValue);
      Alert.alert('Thông báo', res.message || 'Mã xác thực đã được gửi.');
      setStep(2);
    } catch (error) {
      handleErrorApi({ error, setError });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu cuối cùng
  const handleResetPassword = async (values: ResetPasswordInput) => {
    setLoading(true);
    try {
      const res = await useAuth.resetPassword(values);
      Alert.alert('Thành công', res.message);
      router.replace('/(auth)/login');
    } catch (error) {
      handleErrorApi({ error, setError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => step === 1 ? router.back() : setStep(1)}
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
              <Text style={styles.stepLabel}>Email</Text>
            </View>
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, step >= 2 && styles.stepNumberActive]}>2</Text>
              </View>
              <Text style={styles.stepLabel}>Mật khẩu</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={step === 1 ? "mail-outline" : "lock-closed-outline"}
                  size={64}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.title}>
                {step === 1 ? 'Xác nhận Email' : 'Mật khẩu mới'}
              </Text>
              <Text style={styles.description}>
                {step === 1
                  ? 'Nhập email để nhận mã xác nhận đặt lại mật khẩu'
                  : `Nhập mã 6 số đã gửi tới ${emailValue}`}
              </Text>

              {step === 1 ? (
                /* STEP 1: NHẬP EMAIL */
                <View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        icon="mail-outline"
                        placeholder="example@email.com"
                        value={value}
                        onChangeText={onChange}
                        error={errors.email?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        variant="filled"
                      />
                    )}
                  />
                  <Button
                    title="Tiếp tục"
                    onPress={handleSendEmail}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    icon="arrow-forward-outline"
                  />
                </View>
              ) : (
                /* STEP 2: NHẬP OTP VÀ PASS MỚI */
                <View>
                  <Controller
                    control={control}
                    name="code"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        icon="key-outline"
                        placeholder="Mã xác nhận 6 số"
                        value={value}
                        onChangeText={onChange}
                        error={errors.code?.message}
                        keyboardType="number-pad"
                        maxLength={6}
                        textContentType="oneTimeCode" // Quan trọng cho iOS
                        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                        editable={!loading}
                        variant="filled"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        icon="lock-closed-outline"
                        placeholder="Mật khẩu mới"
                        value={value}
                        onChangeText={onChange}
                        error={errors.password?.message}
                        secureTextEntry
                        editable={!loading}
                        variant="filled"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        icon="lock-closed-outline"
                        placeholder="Xác nhận mật khẩu"
                        value={value}
                        onChangeText={onChange}
                        error={errors.confirmPassword?.message}
                        secureTextEntry
                        editable={!loading}
                        variant="filled"
                      />
                    )}
                  />
                  <Button
                    title="Xác nhận thay đổi"
                    onPress={handleSubmit(handleResetPassword)}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    variant="primary"
                  />
                  <Button
                    title="Gửi lại mã"
                    onPress={handleSendEmail}
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, paddingTop: 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.cardBackground, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: 'bold', marginLeft: SPACING.md, color: COLORS.textPrimary },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: COLORS.textMuted, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNumber: { color: COLORS.textMuted, fontSize: 14, fontWeight: 'bold' },
  stepNumberActive: { color: '#fff' },
  stepLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  stepLine: { width: 40, height: 2, backgroundColor: COLORS.textMuted, marginHorizontal: 8, marginTop: -16 },
  stepLineActive: { backgroundColor: COLORS.primary },
  content: { paddingHorizontal: SPACING.lg },
  stepContainer: { backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: SPACING.xl, elevation: 4, shadowOpacity: 0.1 },
  iconContainer: { alignItems: 'center', marginBottom: SPACING.md },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: COLORS.textPrimary },
  description: { textAlign: 'center', color: COLORS.textSecondary, marginVertical: SPACING.md },
});