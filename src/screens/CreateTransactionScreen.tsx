import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, SegmentedButtons, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { Transaccion, TipoTransaccion } from "../types/transaction.types";
import { transactionApi } from "../api/transaction.api";
import { cuentaApi } from "../api/cuenta.api";
import { Cuenta } from "../types/cuenta.types";

export const CreateTransactionScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    monto: "",
    destinatario: "",
    tipo: TipoTransaccion.GASTO,
    cuentaId: 0,
    categoriaId: 1, // Por ahora hardcodeado hasta implementar categorías
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);

  useEffect(() => {
    loadCuentas();
  }, []);

  const loadCuentas = async () => {
    try {
      const response = await cuentaApi.getMisCuentas();
      setCuentas(response);
      if (response.length > 0) {
        setFormData((prev) => ({ ...prev, cuentaId: response[0].id || 0 }));
      }
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    }
  };

  const handleCreate = async () => {
    if (
      !formData.destinatario.trim() ||
      !formData.monto ||
      !formData.cuentaId
    ) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const montoNum = parseFloat(formData.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Error", "Por favor ingrese un monto válido");
      return;
    }

    setIsLoading(true);
    try {
      const newTransaction: Omit<Transaccion, "id"> = {
        monto: montoNum,
        destinatario: formData.destinatario.trim(),
        fecha: new Date().toISOString().split("T")[0],
        tipo: formData.tipo,
        cuentaId: formData.cuentaId,
        categoriaId: formData.categoriaId,
      };

      await transactionApi.createTransaction(newTransaction);
      Alert.alert("Éxito", "Transacción creada correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error creando transacción:", error);
      Alert.alert("Error", "No se pudo crear la transacción");
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
        <SegmentedButtons
          value={formData.tipo}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, tipo: value as TipoTransaccion }))
          }
          buttons={[
            {
              value: TipoTransaccion.GASTO,
              label: "Gasto",
              style:
                formData.tipo === TipoTransaccion.GASTO
                  ? styles.selectedButton
                  : {},
            },
            {
              value: TipoTransaccion.INGRESO,
              label: "Ingreso",
              style:
                formData.tipo === TipoTransaccion.INGRESO
                  ? styles.selectedButton
                  : {},
            },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Monto"
          value={formData.monto}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, monto: text }))
          }
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Destinatario"
          value={formData.destinatario}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, destinatario: text }))
          }
          style={styles.input}
        />

        <Text style={styles.label}>Cuenta</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.cuentaId}
            onValueChange={(itemValue) =>
              setFormData((prev) => ({ ...prev, cuentaId: Number(itemValue) }))
            }
          >
            {cuentas.map((cuenta) => (
              <Picker.Item
                key={cuenta.id}
                label={`${cuenta.nombre} (${cuenta.moneda})`}
                value={cuenta.id}
              />
            ))}
          </Picker>
        </View>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Crear Transacción
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
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
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
