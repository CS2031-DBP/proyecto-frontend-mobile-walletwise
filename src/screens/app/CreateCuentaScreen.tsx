import React, { useState } from "react";
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
import { TipoCuenta, Moneda } from "../../types/cuenta.types";
import { cuentaApi } from "../../api/cuenta.api";
import { useAuth } from "../../context/AuthContext";

export const CreateCuentaScreen = ({ navigation }: any) => {
  // Remover el uso de user.id ya que no es necesario
  const [nombre, setNombre] = useState("");
  const [saldo, setSaldo] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState(TipoCuenta.AHORRO);
  const [moneda, setMoneda] = useState(Moneda.PEN);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCuenta = async () => {
    if (!nombre.trim() || !saldo.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const saldoNum = parseFloat(saldo);
    if (isNaN(saldoNum) || saldoNum < 0) {
      Alert.alert("Error", "Por favor ingrese un saldo válido");
      return;
    }

    setIsLoading(true);
    try {
      const nuevaCuenta = {
        nombre: nombre.trim(),
        saldo: saldoNum,
        tipoCuenta,
        moneda,
      };

      await cuentaApi.createCuenta(nuevaCuenta);
      Alert.alert("Éxito", "Cuenta creada correctamente");
      navigation.goBack();
    } catch (error: any) {
      console.error("Error creando cuenta:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo crear la cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Nueva Cuenta</Text>

        <TextInput
          label="Nombre de la cuenta"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          disabled={isLoading}
        />

        <TextInput
          label="Saldo inicial"
          value={saldo}
          onChangeText={setSaldo}
          keyboardType="decimal-pad"
          style={styles.input}
          disabled={isLoading}
        />

        <Text style={styles.label}>Tipo de Cuenta</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoCuenta}
            onValueChange={(itemValue) =>
              setTipoCuenta(itemValue as TipoCuenta)
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
            selectedValue={moneda}
            onValueChange={(itemValue) => setMoneda(itemValue as Moneda)}
            enabled={!isLoading}
          >
            {Object.values(Moneda).map((mon) => (
              <Picker.Item key={mon} label={mon} value={mon} />
            ))}
          </Picker>
        </View>

        <Button
          mode="contained"
          onPress={handleCreateCuenta}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Crear Cuenta
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
});
