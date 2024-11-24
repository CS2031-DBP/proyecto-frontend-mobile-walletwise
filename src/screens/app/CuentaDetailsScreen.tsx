import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { TipoCuenta, Moneda, Cuenta } from "../../types/cuenta.types";
import { cuentaApi } from "../../api/cuenta.api";

export const CuentaDetailsScreen = ({ route, navigation }: any) => {
  const { cuentaId } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    saldo: "",
    tipoCuenta: TipoCuenta.AHORRO,
    moneda: Moneda.PEN,
  });

  useEffect(() => {
    loadCuentaDetails();
  }, [cuentaId]);

  const loadCuentaDetails = async () => {
    try {
      setIsLoading(true);
      const cuentaData = await cuentaApi.getCuentaById(cuentaId);
      setCuenta(cuentaData);
      setFormData({
        nombre: cuentaData.nombre,
        saldo: cuentaData.saldo.toString(),
        tipoCuenta: cuentaData.tipoCuenta,
        moneda: cuentaData.moneda,
      });
    } catch (error) {
      console.error("Error cargando cuenta:", error);
      Alert.alert("Error", "No se pudo cargar los detalles de la cuenta");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.nombre.trim() || !formData.saldo.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const saldoNum = parseFloat(formData.saldo);
    if (isNaN(saldoNum)) {
      Alert.alert("Error", "Por favor ingrese un saldo válido");
      return;
    }

    setIsLoading(true);
    try {
      const updatedCuenta = {
        ...cuenta,
        nombre: formData.nombre.trim(),
        saldo: saldoNum,
        tipoCuenta: formData.tipoCuenta,
        moneda: formData.moneda,
      };

      await cuentaApi.updateCuenta(cuentaId, updatedCuenta);
      Alert.alert("Éxito", "Cuenta actualizada correctamente");
      setIsEditing(false);
      loadCuentaDetails();
    } catch (error: any) {
      console.error("Error actualizando cuenta:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo actualizar la cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!cuenta || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Detalles de la Cuenta</Text>

        {isEditing ? (
          // Modo edición
          <>
            <TextInput
              label="Nombre de la cuenta"
              value={formData.nombre}
              onChangeText={(text) =>
                setFormData({ ...formData, nombre: text })
              }
              style={styles.input}
              disabled={isLoading}
            />

            <TextInput
              label="Saldo"
              value={formData.saldo}
              onChangeText={(text) => setFormData({ ...formData, saldo: text })}
              keyboardType="decimal-pad"
              style={styles.input}
              disabled={isLoading}
            />

            <Text style={styles.label}>Tipo de Cuenta</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.tipoCuenta}
                onValueChange={(itemValue) =>
                  setFormData({
                    ...formData,
                    tipoCuenta: itemValue as TipoCuenta,
                  })
                }
                enabled={!isLoading}
              >
                {Object.values(TipoCuenta).map((tipo) => (
                  <Picker.Item key={tipo} label={tipo} value={tipo} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Moneda</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.moneda}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, moneda: itemValue as Moneda })
                }
                enabled={!isLoading}
              >
                {Object.values(Moneda).map((mon) => (
                  <Picker.Item key={mon} label={mon} value={mon} />
                ))}
              </Picker>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleUpdate}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                Guardar Cambios
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsEditing(false)}
                disabled={isLoading}
                style={styles.button}
              >
                Cancelar
              </Button>
            </View>
          </>
        ) : (
          // Modo visualización
          <>
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{cuenta.nombre}</Text>

              <Text style={styles.label}>Saldo</Text>
              <Text style={styles.valueHighlight}>
                {cuenta.moneda} {cuenta.saldo.toFixed(2)}
              </Text>

              <Text style={styles.label}>Tipo de Cuenta</Text>
              <Text style={styles.value}>{cuenta.tipoCuenta}</Text>

              <Text style={styles.label}>Moneda</Text>
              <Text style={styles.value}>{cuenta.moneda}</Text>
            </View>

            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.button}
            >
              Editar Cuenta
            </Button>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  valueHighlight: {
    fontSize: 24,
    marginBottom: 15,
    color: "#007AFF",
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
});
