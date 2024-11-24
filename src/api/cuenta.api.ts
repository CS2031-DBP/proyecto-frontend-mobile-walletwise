// src/api/cuenta.api.ts
import { axiosInstance } from "./axios.config";
import { Cuenta } from "../types/cuenta.types";

export const cuentaApi = {
  createCuenta: async (
    cuenta: Omit<Cuenta, "id" | "usuarioId">
  ): Promise<Cuenta> => {
    try {
      const response = await axiosInstance.post<Cuenta>("/api/cuentas", cuenta);
      return response.data;
    } catch (error: any) {
      console.error("Error creando cuenta:", error);
      throw error;
    }
  },

  getMisCuentas: async (): Promise<Cuenta[]> => {
    try {
      const response = await axiosInstance.get<Cuenta[]>(
        "/api/cuentas/miscuentas"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo cuentas:", error);
      throw error;
    }
  },

  getCuentaById: async (id: number): Promise<Cuenta> => {
    try {
      const response = await axiosInstance.get<Cuenta>(`/api/cuentas/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo cuenta:", error);
      throw error;
    }
  },

  updateCuenta: async (
    id: number,
    cuenta: Partial<Cuenta>
  ): Promise<Cuenta> => {
    try {
      const response = await axiosInstance.put<Cuenta>(
        `/api/cuentas/${id}`,
        cuenta
      );
      return response.data;
    } catch (error: any) {
      console.error("Error actualizando cuenta:", error);
      throw error;
    }
  },
};
