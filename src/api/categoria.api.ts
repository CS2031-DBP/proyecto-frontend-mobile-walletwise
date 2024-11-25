// src/api/categoria.api.ts
import { axiosInstance } from "./axios.config";
import { Categoria, SubCategoria } from "../types/categoria.types";

export const categoriaApi = {
  // Categorías principales
  createCategoria: async (
    categoria: Omit<Categoria, "id" | "usuarioId">
  ): Promise<Categoria> => {
    try {
      const response = await axiosInstance.post<Categoria>(
        "/api/categorias",
        categoria
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creando categoría:", error);
      throw error;
    }
  },

  getMisCategorias: async (): Promise<Categoria[]> => {
    try {
      const response = await axiosInstance.get<Categoria[]>("/api/categorias");
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo categorías:", error);
      throw error;
    }
  },

  getCategoriaById: async (id: number): Promise<Categoria> => {
    try {
      const response = await axiosInstance.get<Categoria>(
        `/api/categorias/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo categoría:", error);
      throw error;
    }
  },

  updateCategoria: async (
    id: number,
    categoria: Partial<Categoria>
  ): Promise<Categoria> => {
    try {
      const response = await axiosInstance.put<Categoria>(
        `/api/categorias/${id}`,
        categoria
      );
      return response.data;
    } catch (error: any) {
      console.error("Error actualizando categoría:", error);
      throw error;
    }
  },

  deleteCategoria: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/categorias/${id}`);
    } catch (error: any) {
      console.error("Error eliminando categoría:", error);
      throw error;
    }
  },

  // Subcategorías
  createSubcategoria: async (
    subcategoria: Omit<SubCategoria, "id" | "usuarioId">
  ): Promise<SubCategoria> => {
    try {
      const response = await axiosInstance.post<SubCategoria>(
        `/api/categorias/${subcategoria.categoriaId}/subcategorias`,
        subcategoria
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creando subcategoría:", error);
      throw error;
    }
  },

  getSubcategoriasByCategoria: async (
    categoriaId: number
  ): Promise<SubCategoria[]> => {
    try {
      const response = await axiosInstance.get<SubCategoria[]>(
        `/api/categorias/${categoriaId}/subcategorias`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo subcategorías:", error);
      throw error;
    }
  },

  updateSubcategoria: async (
    categoriaId: number,
    subcategoriaId: number,
    subcategoria: Partial<SubCategoria>
  ): Promise<SubCategoria> => {
    try {
      const response = await axiosInstance.put<SubCategoria>(
        `/api/categorias/${categoriaId}/subcategorias/${subcategoriaId}`,
        subcategoria
      );
      return response.data;
    } catch (error: any) {
      console.error("Error actualizando subcategoría:", error);
      throw error;
    }
  },

  deleteSubcategoria: async (
    categoriaId: number,
    subcategoriaId: number
  ): Promise<void> => {
    try {
      await axiosInstance.delete(
        `/api/categorias/${categoriaId}/subcategorias/${subcategoriaId}`
      );
    } catch (error: any) {
      console.error("Error eliminando subcategoría:", error);
      throw error;
    }
  },
};
