// src/api/auth.api.ts
import { axiosInstance } from "./axios.config";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth.types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log("API: Intentando login con:", credentials);
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      console.log("API: Respuesta exitosa:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API: Error completo:", error);
      console.error("API: Respuesta del servidor:", error.response?.data);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/register",
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.error("API: Error en registro:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error: any) {
      console.error("API: Error en logout:", error);
      throw error;
    }
  },
};
