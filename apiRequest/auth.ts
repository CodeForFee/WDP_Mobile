import api from "@/api/interceptor";
import { ENDPOINT } from "@/api/endpoint";
import { LoginInput, ResetPasswordInput, ForgotPasswordInput, UpdateProfileBody } from "@/schemas/authSchema";
import { AuthTokens, User, ResponseData } from "@/type";

export const authRequest = {
    // POST /auth/login : đăng nhập
    login: (data: LoginInput) => api.post<ResponseData<AuthTokens>>(ENDPOINT.LOGIN, data),

    // POST /auth/logout : đăng xuất
    logout: (refreshToken: string) => api.post<ResponseData<{ message: string }>>(ENDPOINT.LOGOUT, { refreshToken }),

    // POST /auth/refresh : làm mới token
    refreshToken: (refreshToken: string) => api.post<ResponseData<AuthTokens>>(ENDPOINT.REFRESH, { refreshToken }),

    // POST /auth/forgot-password : quên mật khẩu
    forgotPassword: (data: ForgotPasswordInput) => api.post<ResponseData<{ message: string }>>(ENDPOINT.FORGOT_PASSWORD, data),

    // POST /auth/reset-password : reset mật khẩu
    resetPassword: (data: Omit<ResetPasswordInput, 'confirmPassword'>) => api.post<ResponseData<{ message: string }>>(ENDPOINT.RESET_PASSWORD, data),

    // GET /auth/me : xem thông tin cá nhân
    me: () => api.get<ResponseData<User>>(ENDPOINT.PROFILE),

    // PATCH /auth/profile : cập nhật hồ sơ cá nhân
    updateProfile: (data: UpdateProfileBody) => api.patch<ResponseData<User>>(ENDPOINT.UPDATE_PROFILE, data),
};
