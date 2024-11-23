export enum TipoCuenta {
  AHORRO = "AHORRO",
  CORRIENTE = "CORRIENTE",
  INVERSION = "INVERSION",
}

export enum Moneda {
  USD = "USD",
  PEN = "PEN",
  EUR = "EUR",
}

// src/types/cuenta.types.ts
export interface Cuenta {
  id?: number;
  nombre: string;
  saldo: number;
  tipoCuenta: TipoCuenta;
  moneda: Moneda;
  usuarioId?: number; // Hacer opcional ya que no se necesita para crear
}

// Eliminar CreateCuentaDto ya que no es necesario
