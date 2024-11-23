import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Cuenta } from "../types/cuenta.types";

interface CuentaCardProps {
  cuenta: Cuenta;
}

export const CuentaCard = ({ cuenta }: CuentaCardProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{cuenta.nombre}</Text>
        <Text style={styles.saldo}>
          {cuenta.moneda} {cuenta.saldo.toFixed(2)}
        </Text>
        <Text style={styles.tipo}>{cuenta.tipoCuenta}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saldo: {
    fontSize: 24,
    color: "#007AFF",
    marginVertical: 5,
  },
  tipo: {
    color: "#666",
    fontSize: 14,
  },
});
