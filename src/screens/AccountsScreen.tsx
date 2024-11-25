import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { FAB } from "react-native-paper";
import { CuentaCard } from "../components/CuentaCard";
import { cuentaApi } from "../api/cuenta.api";
import { Cuenta } from "../types/cuenta.types";

export const AccountsScreen = ({ navigation }: any) => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCuentas = async () => {
    try {
      setIsLoading(true);
      const response = await cuentaApi.getMisCuentas();
      setCuentas(response);
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCuentas();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCuentas();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadCuentas} />
        }
      >
        {cuentas.map((cuenta) => (
          <CuentaCard key={cuenta.id} cuenta={cuenta} />
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("CreateCuenta")}
        label="Nueva Cuenta"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
});
