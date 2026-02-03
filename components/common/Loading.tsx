import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Màn hình loading toàn màn (dùng khi check auth, v.v.).
 * Dùng LoadingSpinner từ assets/images/loading.svg cho toàn hệ thống.
 */
export const Loading = () => {
  return (
    <View style={styles.container}>
      <LoadingSpinner size={48} color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
