import { z } from "zod";

export const LoginBody = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(32, "Mật khẩu tối đa 32 ký tự"),
});

export type LoginBodyType = z.infer<typeof LoginBody>;
export type LoginInput = LoginBodyType;

export const LogoutBody = z.object({
  refreshToken: z.string().min(1, "Refresh token là bắt buộc"),
});

export type LogoutBodyType = z.infer<typeof LogoutBody>;

export const ForgotPasswordBody = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;
export type ForgotPasswordInput = ForgotPasswordBodyType;

export const ResetPasswordBody = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    code: z
      .string()
      .length(6, "OTP phải có đúng 6 ký tự")
      .regex(/^\d+$/, "OTP chỉ được chứa chữ số"),
    password: z
      .string()
      .min(6, "Mật khẩu mới tối thiểu 6 ký tự")
      .max(32, "Mật khẩu mới tối đa 32 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
export type ResetPasswordInput = ResetPasswordBodyType;

export const RefreshTokenBody = z.object({
  refreshToken: z.string().min(1, "Refresh token là bắt buộc"),
});

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBody>;

export const UpdateProfileBody = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
});

export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBody>;
