import { axiosInstance } from "./axios.config";
import { Categoria } from "../types/category.types";

export const categoryApi = {
  getCategorias: async (): Promise<Categoria[]> => {
    try {
      const response = await axiosInstance.get<Categoria[]>("/api/categorias");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      throw error;
    }
  },
};
