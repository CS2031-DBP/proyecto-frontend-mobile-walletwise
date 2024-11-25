import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  IconButton,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  Transaccion,
  TipoTransaccion,
  TransactionLocation,
} from "../types/transaction.types";
import { transactionApi } from "../api/transaction.api";
import { locationStorage } from "../utils/locationStorage";
import { cuentaApi } from "../api/cuenta.api";
import { categoriaApi } from "../api/categoria.api";
import { Cuenta } from "../types/cuenta.types";
import { Categoria } from "../types/categoria.types";
import * as Location from "expo-location";

export const CreateTransactionScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    monto: "",
    destinatario: "",
    tipo: TipoTransaccion.GASTO,
    cuentaId: 0,
    categoriaId: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [location, setLocation] = useState<TransactionLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    loadCuentas();
    loadCategorias();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        await getCurrentLocation();
      }
    } catch (error) {
      console.error("Error solicitando permisos de ubicación:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Obtener la dirección usando geocoding inverso
      const [geocodeResponse] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        direccion: geocodeResponse
          ? `${geocodeResponse.street || ""} ${geocodeResponse.name || ""}, ${
              geocodeResponse.city || ""
            }`.trim()
          : undefined,
      });
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
    }
  };

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

  const loadCategorias = async () => {
    try {
      const response = await categoriaApi.getMisCategorias();
      setCategorias(response);
      if (response.length > 0) {
        setFormData((prev) => ({
          ...prev,
          categoriaId: response[0].id || 0,
        }));
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const handleCreate = async () => {
    if (
      !formData.destinatario.trim() ||
      !formData.monto ||
      !formData.cuentaId ||
      !formData.categoriaId
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
        ubicacion: location || undefined,
      };

      // Crear la transacción y obtener la respuesta
      const createdTransaction = await transactionApi.createTransaction(
        newTransaction
      );

      // Si tenemos ubicación y la transacción se creó exitosamente con un ID
      if (location && createdTransaction.id) {
        console.log(
          "Guardando ubicación para transacción:",
          createdTransaction.id
        );
        await locationStorage.saveLocation(createdTransaction.id, location);
        console.log("Ubicación guardada exitosamente");
      }

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

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.categoriaId}
            onValueChange={(itemValue) =>
              setFormData((prev) => ({
                ...prev,
                categoriaId: Number(itemValue),
              }))
            }
          >
            {categorias.map((categoria) => (
              <Picker.Item
                key={categoria.id}
                label={categoria.nombre}
                value={categoria.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.label}>Ubicación</Text>
          {locationPermission ? (
            <>
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  {location?.direccion || "Obteniendo ubicación..."}
                </Text>
                <IconButton
                  icon="refresh"
                  size={20}
                  onPress={getCurrentLocation}
                  disabled={isLoading}
                />
              </View>
              {location && (
                <Text style={styles.coordsText}>
                  {`${location.latitude.toFixed(
                    6
                  )}, ${location.longitude.toFixed(6)}`}
                </Text>
              )}
            </>
          ) : (
            <Button
              mode="outlined"
              onPress={requestLocationPermission}
              style={styles.permissionButton}
            >
              Permitir acceso a ubicación
            </Button>
          )}
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
  locationContainer: {
    marginBottom: 15,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  coordsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
});

export default CreateTransactionScreen;
