import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@/components/common';
import { useAuthContext } from '@/contexts/authContext';
import { authSchema, LoginInput } from '@/schemas/authSchema';
import { handleErrorApi } from '@/lib/errors';
import Svg, { Path } from 'react-native-svg';

// --- GOOGLE ICON SVG ---
const GoogleIcon = () => (
  <Svg viewBox="-3 0 262 262" width={32} height={32}>
    <Path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" />
    <Path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" />
    <Path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" />
    <Path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setError, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: 'jonnytran.working@gmail.com', password: 'pass123456789' },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      setLoading(true);
      await login(values);
      router.replace('/(franchise-staff)/(tabs)');
    } catch (error) {
      handleErrorApi({ error, setError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Crispy Pro</Text>
          <Text style={styles.subtitle}>Quản lý kho hàng chuyên nghiệp</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Email Address"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                variant="filled" // Sử dụng variant có sẵn để tạo khung trắng
                icon="mail-outline" // Thêm icon cho đẹp
                inputStyle={{ backgroundColor: '#FFF' }} // Đảm bảo nền bên trong trắng
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
                variant="filled"
                icon="lock-closed-outline"
                inputStyle={{ backgroundColor: '#FFF' }}
              />
            )}
          />

          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button 
            title="Sign In" 
            loading={loading} 
            onPress={handleSubmit(onSubmit)} 
            style={styles.signInBtn} 
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity activeOpacity={0.6}>
            <GoogleIcon />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F0' },
  scrollContent: { flexGrow: 1, padding: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 120, height: 120, marginBottom: 10 },
  appName: { fontSize: 30, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
  subtitle: { fontSize: 15, color: '#777', marginTop: 4 },
  formContainer: { width: '100%' },
  forgotText: { textAlign: 'right', color: '#89A54D', fontWeight: '700', marginVertical: 12 },
  signInBtn: { backgroundColor: '#89A54D', borderRadius: 20, height: 56, marginTop: 10 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 40 },
  line: { flex: 1, height: 1, backgroundColor: '#D6DBCF' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 13, fontWeight: '600' },
  socialRow: { alignItems: 'center', justifyContent: 'center' },
});