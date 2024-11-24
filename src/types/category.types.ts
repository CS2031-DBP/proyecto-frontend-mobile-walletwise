export enum TipoTransaccion {
  INGRESO = "INGRESO",
  GASTO = "GASTO",
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  tipo: TipoTransaccion; // Para identificar si es categoría de ingreso o gasto
}
