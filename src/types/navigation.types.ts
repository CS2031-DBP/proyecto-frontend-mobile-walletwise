import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  Accounts: undefined;
  CreateCuenta: undefined;
  TransactionDetails: {
    transactionId: number;
  };
  CuentaDetails: {
    cuentaId: number;
  };
  CreateTransaction: undefined;
  Transactions: undefined;
  Categories: undefined;
  CreateCategory: undefined;
  EditCategory: {
    categoryId: number;
  };
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;
