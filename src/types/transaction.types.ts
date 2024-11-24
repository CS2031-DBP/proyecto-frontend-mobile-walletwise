export enum TipoTransaccion {
  GASTO = "GASTO",
  INGRESO = "INGRESO",
}

export interface Transaccion {
  id?: number;
  monto: number;
  destinatario: string;
  fecha: string;
  tipo: TipoTransaccion;
  cuentaId: number;
  categoriaId: number;
}

export interface TransaccionesResponse {
  totalItems: number;
  transacciones: Transaccion[];
  totalPages: number;
  currentPage: number;
}
