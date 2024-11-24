// DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, FAB, Button, IconButton } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { cuentaApi } from "../../api/cuenta.api";
import { transactionApi } from "../../api/transaction.api";
import { Cuenta } from "../../types/cuenta.types";
import { Transaccion } from "../../types/transaction.types";
import { CuentaCard } from "../../components/CuentaCard";
import { TransactionCard } from "../../components/TransactionCard";

export const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaccion[]>(
    []
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cuentasResponse, transaccionesResponse] = await Promise.all([
        cuentaApi.getMisCuentas(),
        transactionApi.getMisTransacciones(),
      ]);

      setCuentas(cuentasResponse);
      setRecentTransactions(transaccionesResponse.slice(0, 5));

      const total = cuentasResponse.reduce(
        (acc, cuenta) => acc + cuenta.saldo,
        0
      );
      setTotalBalance(total);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} />
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Cuentas</Text>
            <IconButton
              icon="plus"
              size={24}
              onPress={() => navigation.navigate("CreateCuenta")}
              iconColor="#007AFF"
            />
          </View>
          {cuentas.length > 0 ? (
            cuentas.map((cuenta) => (
              <CuentaCard key={cuenta.id} cuenta={cuenta} />
            ))
          ) : (
            <Text style={styles.emptyText}>No tienes cuentas registradas</Text>
          )}
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas Transacciones</Text>
            <IconButton
              icon="plus"
              size={24}
              onPress={() => navigation.navigate("CreateTransaction")}
              iconColor="#007AFF"
            />
          </View>
          {recentTransactions.length > 0 ? (
            <>
              {recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
              <Button
                mode="text"
                onPress={() => navigation.navigate("Transactions")}
                style={styles.viewAllButton}
              >
                Ver todas las transacciones
              </Button>
            </>
          ) : (
            <Text style={styles.emptyText}>No hay transacciones recientes</Text>
          )}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("CreateTransaction")}
        label="Nueva Transacción"
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cuentasSection: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  transactionsSection: {
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  viewAllButton: {
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
});
