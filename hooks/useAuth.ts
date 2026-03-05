import { authRequest } from "@/apiRequest/auth";
import { uploadRequest } from "@/apiRequest/upload";
import { LoginInput, ResetPasswordInput, ForgotPasswordInput, UpdateProfileBody } from "@/schemas/authSchema";

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
  },
  updateProfile: async (data: UpdateProfileBody) => {
    const res = await authRequest.updateProfile(data);
    return res.data.data;
  },
  uploadAvatar: async (uri: string) => {
    const filename = uri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const result = await uploadRequest.uploadImage(formData);
    return result.url;
  },
};
