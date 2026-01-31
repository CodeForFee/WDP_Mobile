import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_BASE_URL: z
    .string()
    .url('EXPO_PUBLIC_BASE_URL phải là URL hợp lệ'),

    EXPO_PUBLIC_GOOGLE_CLIENT_ID: z
      .string()
      .min(1, 'EXPO_PUBLIC_GOOGLE_CLIENT_ID không được để trống'),

       EXPO_PUBLIC_SECRET_KEY: z
      .string()
        .min(1, 'EXPO_PUBLIC_SECRET_KEY không được để trống'),

      
});

const envConfig = envSchema.safeParse({
  EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
  EXPO_PUBLIC_GOOGLE_CLIENT_ID:
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    EXPO_PUBLIC_SECRET_KEY:
    process.env.EXPO_PUBLIC_SECRET_KEY,
});

if (!envConfig.success) {
  console.error('❌ Invalid environment variables');
  console.error(envConfig.error.flatten().fieldErrors);
  throw new Error('Invalid configuration');
}

export const envconfig = envConfig.data;
export default envconfig;
