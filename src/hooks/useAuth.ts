import { useMutation } from "@tanstack/react-query";
import { authLogin, type LoginPayload } from "../services/auth.services";

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: ({ request }: { request: LoginPayload }) => authLogin(request),

    onSuccess: () => {},

    onError: (error: Error) => {
      console.log("Failed to login.", error);
    },
  });
};
