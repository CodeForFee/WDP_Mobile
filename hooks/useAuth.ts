import api from "@/api/baseApi";
import { ENDPOINT } from "@/api/endpoint";
import { LoginInput, ResetPasswordInput } from "@/schemas/authSchema";
import { AuthTokens, ResponseData, User } from "@/type";

export const useAuth = {
  login: async (loginInput: LoginInput): Promise<AuthTokens> => {
    const res = await api.post<ResponseData<AuthTokens>>(
      ENDPOINT.LOGIN,
      loginInput,
    );
    return res.data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post<ResponseData<{ message: string }>>(ENDPOINT.LOGOUT, {
      refreshToken,
    });
  },
  forgotPassword: async (email: string): Promise<{message: string}> => {
   const res = await api.post<ResponseData<{message: string}>>(
      ENDPOINT.FORGOT_PASSWORD,
      { email },
    );
    return res.data.data;

  },
  resetPassword: async (
    resetPasswordInput: ResetPasswordInput,
  ): Promise<{message: string}> => {
    const { confirmPassword, ...body } = resetPasswordInput;
    const res = await api.post<ResponseData<{message: string}>>(
      ENDPOINT.RESET_PASSWORD,
      body,
    );
    return res.data.data;
   
  },
  me: async (): Promise<User> => {
    const res = await api.get<ResponseData<User>>(ENDPOINT.PROFILE);
    return res.data.data;
  }
};
