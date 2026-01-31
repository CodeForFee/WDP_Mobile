import api from "@/api/baseApi";
import { AUTH_ENDPOINT } from "@/api/endpoint";
import { LoginInput, ResetPasswordInput } from "@/schemas/authSchema";
import { AuthTokens, ResponseData } from "@/type";

export const useAuth = {
  login: async (loginInput: LoginInput): Promise<AuthTokens> => {
    const res = await api.post<ResponseData<AuthTokens>>(
      AUTH_ENDPOINT.LOGIN,
      loginInput,
    );
    return res.data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post<ResponseData<{ message: string }>>(AUTH_ENDPOINT.LOGOUT, {
      refreshToken,
    });
  },
  forgotPassword: async (email: string): Promise<boolean> => {
    const res = await api.post<ResponseData<null>>(
      AUTH_ENDPOINT.FORGOT_PASSWORD,
      { email },
    );
      if (res.data.statusCode !== 201) {
        return false;
      }
      return true;
  },
  resetPassword: async (
    resetPasswordInput: ResetPasswordInput,
  ): Promise<boolean> => {
    const { confirmPassword, ...body } = resetPasswordInput;

    const res = await api.post<ResponseData<null>>(
      AUTH_ENDPOINT.RESET_PASSWORD,
      body,
    );
    if (res.data.statusCode !== 200) {
      return false;
    }
    return true;
  },
};
