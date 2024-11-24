// src/types/navigation.types.ts
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  CreateCuenta: undefined;
  CuentaDetails: {
    cuentaId: number;
  };
  CreateTransaction: undefined;
  Transactions: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;
