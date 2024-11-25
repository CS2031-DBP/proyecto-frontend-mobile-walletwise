import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Linking, Platform } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { transactionApi } from "../api/transaction.api";
import { locationStorage } from "../utils/locationStorage";
import { Transaccion } from "../types/transaction.types";

export const TransactionDetailsScreen = ({ route }: any) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState<Transaccion | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactionDetails();
  }, [transactionId]);

  const loadTransactionDetails = async () => {
    try {
      setIsLoading(true);
      console.log("Cargando detalles para transacción:", transactionId);

      const [transactionData, locationData] = await Promise.all([
        transactionApi.getTransactionById(transactionId),
        locationStorage.getLocation(transactionId),
      ]);

      console.log("Datos de transacción obtenidos:", transactionData);
      console.log("Datos de ubicación obtenidos:", locationData);

      setTransaction(transactionData);
      setLocation(locationData);
    } catch (error) {
      console.error("Error loading details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openMaps = () => {
    if (!location) return;

    const { latitude, longitude } = location;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la transacción</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{transaction.destinatario}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Monto:</Text>
            <Text
              style={[
                styles.amount,
                transaction.tipo === "INGRESO" ? styles.income : styles.expense,
              ]}
            >
              {transaction.tipo === "INGRESO" ? "+" : "-"} S/.{" "}
              {transaction.monto.toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>
              {new Date(transaction.fecha).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{transaction.tipo}</Text>
          </View>

          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.label}>Ubicación:</Text>
              <Text style={styles.locationText}>
                {location.direccion ||
                  `${location.latitude.toFixed(
                    6
                  )}, ${location.longitude.toFixed(6)}`}
              </Text>
              <Button
                mode="contained"
                onPress={openMaps}
                icon="map-marker"
                style={styles.mapButton}
              >
                Ver en Mapa
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  income: {
    color: "#2ecc71",
  },
  expense: {
    color: "#e74c3c",
  },
  locationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
    marginBottom: 8,
  },
  mapButton: {
    marginTop: 8,
  },
});
