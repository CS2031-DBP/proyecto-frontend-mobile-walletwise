// src/types/transaction.types.ts
export enum TipoTransaccion {
  GASTO = "GASTO",
  INGRESO = "INGRESO",
}

export interface TransactionLocation {
  latitude: number;
  longitude: number;
  direccion?: string;
}

export interface Transaccion {
  id?: number;
  monto: number;
  destinatario: string;
  fecha: string;
  tipo: TipoTransaccion;
  cuentaId: number;
  categoriaId: number;
  ubicacion?: TransactionLocation; // Nueva propiedad
}
