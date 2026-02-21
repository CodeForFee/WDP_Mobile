import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { LoginInput, ResetPasswordInput, ForgotPasswordInput } from "@/schemas/authSchema";
import { AuthTokens, User, ResponseData } from "@/type";

export const authRequest = {
    login: (data: LoginInput) => api.post<ResponseData<AuthTokens>>(ENDPOINT.LOGIN, data),

    logout: (refreshToken: string) => api.post<ResponseData<{ message: string }>>(ENDPOINT.LOGOUT, { refreshToken }),

    refreshToken: (refreshToken: string) => api.post<ResponseData<AuthTokens>>(ENDPOINT.REFRESH, { refreshToken }),

    forgotPassword: (data: ForgotPasswordInput) => api.post<ResponseData<{ message: string }>>(ENDPOINT.FORGOT_PASSWORD, data),

    resetPassword: (data: Omit<ResetPasswordInput, 'confirmPassword'>) => api.post<ResponseData<{ message: string }>>(ENDPOINT.RESET_PASSWORD, data),

    me: () => api.get<ResponseData<User>>(ENDPOINT.PROFILE),
};
