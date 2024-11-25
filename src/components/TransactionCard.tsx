import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Transaccion, TipoTransaccion } from "../types/transaction.types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation.types";

interface TransactionCardProps {
  transaction: Transaccion;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (transaction.id) {
      navigation.navigate("TransactionDetails", {
        transactionId: transaction.id,
      });
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Text style={styles.destinatario}>{transaction.destinatario}</Text>
        <Text
          style={[
            styles.monto,
            transaction.tipo === TipoTransaccion.INGRESO
              ? styles.ingreso
              : styles.gasto,
          ]}
        >
          {transaction.tipo === TipoTransaccion.INGRESO ? "+" : "-"}
          S/. {transaction.monto.toFixed(2)}
        </Text>
        <Text style={styles.fecha}>
          {new Date(transaction.fecha).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    elevation: 2,
  },
  destinatario: {
    fontSize: 16,
    fontWeight: "500",
  },
  monto: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  ingreso: {
    color: "#2ecc71", // Verde para ingresos
  },
  gasto: {
    color: "#e74c3c", // Rojo para gastos
  },
  fecha: {
    fontSize: 12,
    color: "#666",
  },
});
