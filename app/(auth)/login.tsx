import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SIZES } from '@/constants/theme';
import { Input, Button } from '@/components/common';
import { useAuthContext } from '@/lib/authContext';
import { LoginInput } from '@/schemas/authSchema';


export default function LoginScreen() {
  const router = useRouter();
  // Pre-fill with a test account for ease of use
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('pass123456789');
  const [loading, setLoading] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const { login } = useAuthContext();
  const handleLogin = async ({ email, password }: LoginInput) => {
    // call api
    setLoading(true);
    try {
      login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role: string) => {
    setShowRoleSelector(false);
    switch (role) {
      case 'franchise':
        router.replace('/(franchise-staff)');
        break;
      // case 'kitchen':
      //   router.replace('/(kitchen-staff)');
      //   break;
      // case 'coordinator':
      //   router.replace('/(coordinator)');
      //   break;

    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="fast-food" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Crispy Pro</Text>
          <Text style={styles.tagline}>Franchise Operations Management</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>Please sign in to your account</Text>

          <Input
            label="Email Address"
            placeholder="name@company.com"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
          />

          <View style={styles.forgotPasswordRow}>
            <TouchableOpacity style={styles.rememberMe}>
              <View style={styles.checkbox}>
                <Ionicons name="checkmark" size={14} color={COLORS.primary} />
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <Link href="/(auth)/forgot-password">
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Link>
          </View>

          <Button
            title="Sign In"
            onPress={() => handleLogin({ email, password })}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.signInButton}
          />


          {/* Social Login */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Role Selection Modal (Simulated) */}
          {showRoleSelector && (
            <View style={styles.roleOverlay}>
              <View style={styles.roleModal}>
                <Text style={styles.roleTitle}>Select Role</Text>
                <Text style={styles.roleSubtitle}>Which dashboard would you like to access?</Text>

                <TouchableOpacity
                  style={styles.roleOption}
                  onPress={() => selectRole('franchise')}
                >
                  <View style={[styles.roleIcon, { backgroundColor: COLORS.primaryLight }]}>
                    <Ionicons name="storefront" size={24} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.roleName}>Franchise Staff</Text>
                    <Text style={styles.roleDesc}>Store Operations & Sales</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roleOption}
                  onPress={() => selectRole('kitchen')}
                >
                  <View style={[styles.roleIcon, { backgroundColor: COLORS.errorLight }]}>
                    <Ionicons name="restaurant" size={24} color={COLORS.error} />
                  </View>
                  <View>
                    <Text style={styles.roleName}>Kitchen Staff</Text>
                    <Text style={styles.roleDesc}>Production & Inventory</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roleOption}
                  onPress={() => selectRole('coordinator')}
                >
                  <View style={[styles.roleIcon, { backgroundColor: COLORS.infoLight }]}>
                    <Ionicons name="navigate" size={24} color={COLORS.info} />
                  </View>
                  <View>
                    <Text style={styles.roleName}>Coordinator</Text>
                    <Text style={styles.roleDesc}>Dispatch & Logistics</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  formContainer: {
    width: '100%',
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  forgotPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    backgroundColor: COLORS.backgroundSecondary,
  },
  rememberText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  forgotText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  signInButton: {
    marginBottom: SPACING.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: SPACING.md,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  // Role Modal Styles
  roleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderRadius: RADIUS.lg,
  },
  roleModal: {
    width: '100%',
    padding: SPACING.lg,
  },
  roleTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  roleSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  roleName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  roleDesc: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
});
