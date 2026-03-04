import { authRequest } from "@/apiRequest/auth";
import { LoginInput, ResetPasswordInput, ForgotPasswordInput } from "@/schemas/authSchema";

export const useAuth = {
  login: async (loginInput: LoginInput) => {
    const res = await authRequest.login(loginInput);
    return res.data.data;
  },
  logout: async (refreshToken: string) => {
    await authRequest.logout(refreshToken);
  },
  forgotPassword: async (email: string) => {
    const res = await authRequest.forgotPassword({ email });
    return res.data.data;
  },
  resetPassword: async (resetPasswordInput: ResetPasswordInput) => {
    const { confirmPassword, ...body } = resetPasswordInput;
    const res = await authRequest.resetPassword(body);
    return res.data.data;
  },
  me: async () => {
    const res = await authRequest.me();
    return res.data.data;
  }
};
