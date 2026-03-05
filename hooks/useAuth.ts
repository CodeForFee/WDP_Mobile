import { authRequest } from "@/apiRequest/auth";
import { LoginInput, ResetPasswordInput } from "@/schemas/authSchema";
import { QUERY_KEY } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const useMe = () => {
    return useQuery({
      queryKey: QUERY_KEY.auth.me(),
      queryFn: async () => {
        const res = await authRequest.me();
        return res.data.data;
      },
    });
  };

  const loginMutation = useMutation({
    mutationFn: async (loginInput: LoginInput) => {
      const res = await authRequest.login(loginInput);
      return res.data.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async (refreshToken: string) => {
      await authRequest.logout(refreshToken);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await authRequest.forgotPassword({ email });
      return res.data.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (resetPasswordInput: ResetPasswordInput) => {
      const { confirmPassword, ...body } = resetPasswordInput;
      const res = await authRequest.resetPassword(body);
      return res.data.data;
    },
  });

  return {
    useMe,
    loginMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
