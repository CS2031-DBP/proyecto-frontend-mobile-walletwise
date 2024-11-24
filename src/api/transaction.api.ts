import { axiosInstance } from "./axios.config";
import { Transaccion, TransaccionesResponse } from "../types/transaction.types";

export const transactionApi = {
  createTransaction: async (
    transaccion: Omit<Transaccion, "id">
  ): Promise<Transaccion> => {
    try {
      const response = await axiosInstance.post<Transaccion>(
        "/api/transacciones",
        transaccion
      );
      return response.data;
    } catch (error) {
      console.error("Error creando transacción:", error);
      throw error;
    }
  },

  getMisTransacciones: async (): Promise<Transaccion[]> => {
    try {
      const response = await axiosInstance.get<TransaccionesResponse>(
        "/api/transacciones/mistransacciones"
      );
      return response.data.transacciones;
    } catch (error) {
      console.error("Error obteniendo transacciones:", error);
      return [];
    }
  },

  getTransactionById: async (id: number): Promise<Transaccion> => {
    try {
      const response = await axiosInstance.get<Transaccion>(
        `/api/transacciones/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo transacción:", error);
      throw error;
    }
  },
};
