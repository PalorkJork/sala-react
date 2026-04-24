import api from "./lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authLogin = async (request: LoginPayload) => {
  return await api.post(`/api/v1/auth/login`, request);
};
