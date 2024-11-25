import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../types/navigation.types";
import { useAuth } from "../../context/AuthContext";
import { cuentaApi } from "../../api/cuenta.api";
import { Moneda } from "../../types/cuenta.types";

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProps["navigation"]>();
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState<Record<Moneda, number>>({
    [Moneda.USD]: 0,
    [Moneda.PEN]: 0,
    [Moneda.EUR]: 0,
  });

  const loadBalances = async () => {
    try {
      const cuentasResponse = await cuentaApi.getMisCuentas();

      // Calcular balances por moneda
      const balances = cuentasResponse.reduce(
        (acc, cuenta) => {
          return {
            ...acc,
            [cuenta.moneda]: (acc[cuenta.moneda] || 0) + cuenta.saldo,
          };
        },
        {
          [Moneda.USD]: 0,
          [Moneda.PEN]: 0,
          [Moneda.EUR]: 0,
        } as Record<Moneda, number>
      );

      setTotalBalance(balances);
    } catch (error) {
      console.error("Error cargando balances:", error);
    }
  };

  useEffect(() => {
    loadBalances();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}
        </Text>

        <View style={styles.balancesContainer}>
          {Object.entries(totalBalance).map(([moneda, monto]) => (
            <Text key={moneda} style={styles.balanceText}>
              Balance {moneda}: {monto.toFixed(2)}
            </Text>
          ))}
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Accounts")}
        >
          <Text style={styles.buttonText}>Cuentas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Transactions")}
        >
          <Text style={styles.buttonText}>Transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={styles.buttonText}>Categorias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  balancesContainer: {
    gap: 8,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
  },
  buttonsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "600",
  },
});
