// src/types/categoria.types.ts
export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  usuarioId?: number;
}

export interface SubCategoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  usuarioId?: number;
}
