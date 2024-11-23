import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { cuentaApi } from "../../api/cuenta.api";
import { Cuenta } from "../../types/cuenta.types";
import { CuentaCard } from "../../components/CuentaCard";

export const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

  const loadCuentas = async () => {
    try {
      setIsLoading(true);
      const response = await cuentaApi.getMisCuentas();
      setCuentas(response);

      const total = response.reduce((acc, cuenta) => acc + cuenta.saldo, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCuentas();
  }, [user?.id]);

  // Suscribirse a eventos de navegación para recargar cuando vuelva a la pantalla
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
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}
          </Text>
          <Text style={styles.balanceText}>
            Balance Total: S/. {totalBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cuentasSection}>
          <Text style={styles.sectionTitle}>Tus Cuentas</Text>
          {cuentas.length > 0 ? (
            cuentas.map((cuenta) => (
              <CuentaCard key={cuenta.id} cuenta={cuenta} />
            ))
          ) : (
            <Text style={styles.emptyText}>No tienes cuentas registradas</Text>
          )}
        </View>
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
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#007AFF",
  },
  cuentasSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
});
