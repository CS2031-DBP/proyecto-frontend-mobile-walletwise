// src/api/cuenta.api.ts
import { axiosInstance } from "./axios.config";
import { Cuenta } from "../types/cuenta.types";

export const cuentaApi = {
  // Modificar para usar el nuevo endpoint sin usuarioId
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

  // Modificar para usar el nuevo endpoint de mis cuentas
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
};
