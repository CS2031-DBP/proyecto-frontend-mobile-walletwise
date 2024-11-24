// src/screens/TransactionsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { FAB } from "react-native-paper";
import { TransactionCard } from "../components/TransactionCard";
import { transactionApi } from "../api/transaction.api";
import { Transaccion } from "../types/transaction.types";

export const TransactionsScreen = ({ navigation }: any) => {
  const [transactions, setTransactions] = useState<Transaccion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionApi.getMisTransacciones();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTransactions();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() =>
              navigation.navigate("TransactionDetails", {
                transactionId: item.id,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadTransactions} />
        }
      />
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
    padding: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
});
