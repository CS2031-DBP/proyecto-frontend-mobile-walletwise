// src/screens/app/CreateCategoryScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { categoriaApi } from "../../api/categoria.api";

export const CreateCategoryScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert("Error", "Por favor ingrese un nombre para la categoría");
      return;
    }

    setIsLoading(true);
    try {
      const nuevaCategoria = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        tipo: "GASTO", // Por defecto será GASTO
      };

      await categoriaApi.createCategoria(nuevaCategoria);
      Alert.alert("Éxito", "Categoría creada correctamente");
      navigation.goBack();
    } catch (error: any) {
      console.error("Error creando categoría:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo crear la categoría"
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
        <TextInput
          label="Nombre de la categoría"
          value={formData.nombre}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, nombre: text }))
          }
          style={styles.input}
          disabled={isLoading}
        />

        <TextInput
          label="Descripción (opcional)"
          value={formData.descripcion}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, descripcion: text }))
          }
          style={styles.input}
          disabled={isLoading}
          multiline
        />

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Crear Categoría
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
  button: {
    marginTop: 20,
    padding: 5,
  },
});
