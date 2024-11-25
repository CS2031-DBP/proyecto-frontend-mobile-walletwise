// src/screens/app/EditCategoryScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, IconButton, Text } from "react-native-paper";
import { categoriaApi } from "../../api/categoria.api";
import ColorPicker from "react-native-wheel-color-picker";
import { Categoria, SubCategoria } from "../../types/categoria.types";

export const EditCategoryScreen = ({ route, navigation }: any) => {
  const { categoryId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "#007AFF",
    icono: "folder",
  });

  useEffect(() => {
    loadCategoryDetails();
  }, [categoryId]);

  const loadCategoryDetails = async () => {
    try {
      setIsLoading(true);
      const [categoriaData, subcategoriasData] = await Promise.all([
        categoriaApi.getCategoriaById(categoryId),
        categoriaApi.getSubcategoriasByCategoria(categoryId),
      ]);

      setCategoria(categoriaData);
      setSubcategorias(subcategoriasData);
      setFormData({
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || "",
        color: categoriaData.color || "#007AFF",
        icono: categoriaData.icono || "folder",
      });
    } catch (error) {
      console.error("Error cargando detalles de categoría:", error);
      Alert.alert("Error", "No se pudo cargar los detalles de la categoría");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert("Error", "Por favor ingrese un nombre para la categoría");
      return;
    }

    setIsLoading(true);
    try {
      const updatedCategoria = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        color: formData.color,
        icono: formData.icono,
      };

      await categoriaApi.updateCategoria(categoryId, updatedCategoria);
      Alert.alert("Éxito", "Categoría actualizada correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      Alert.alert("Error", "No se pudo actualizar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubcategoria = async (subcategoriaId: number) => {
    Alert.alert(
      "Eliminar Subcategoría",
      "¿Estás seguro de que deseas eliminar esta subcategoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await categoriaApi.deleteSubcategoria(categoryId, subcategoriaId);
              loadCategoryDetails();
            } catch (error) {
              console.error("Error eliminando subcategoría:", error);
              Alert.alert("Error", "No se pudo eliminar la subcategoría");
            }
          },
        },
      ]
    );
  };

  if (!categoria) {
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

        {/* Color Picker Section */}
        <View style={styles.colorSection}>
          <TextInput
            label="Color"
            value={formData.color}
            right={
              <TextInput.Icon
                icon="palette"
                onPress={() => setShowColorPicker(true)}
              />
            }
            style={styles.input}
            disabled
          />
          {showColorPicker && (
            <View style={styles.colorPicker}>
              <ColorPicker
                color={formData.color}
                onColorChange={(color) =>
                  setFormData((prev) => ({ ...prev, color }))
                }
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
              />
              <Button
                mode="text"
                onPress={() => setShowColorPicker(false)}
                style={styles.colorPickerButton}
              >
                Cerrar
              </Button>
            </View>
          )}
        </View>

        {/* Icon Selection Section */}
        <View style={styles.iconSection}>
          <IconButton
            icon={formData.icono}
            size={40}
            iconColor={formData.color}
            style={styles.selectedIcon}
          />
          <ScrollView horizontal style={styles.iconList}>
            {[
              "folder",
              "shopping",
              "food",
              "car",
              "home",
              "medical-bag",
              "school",
              "wallet",
              "gift",
              "airplane",
              "credit-card",
              "bank",
              "cash",
            ].map((icon) => (
              <IconButton
                key={icon}
                icon={icon}
                size={30}
                iconColor={formData.icono === icon ? formData.color : "#666"}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, icono: icon }))
                }
                style={styles.iconOption}
              />
            ))}
          </ScrollView>
        </View>

        {/* Subcategorías Section */}
        <View style={styles.subcategoriasSection}>
          <Text style={styles.sectionTitle}>Subcategorías</Text>
          {subcategorias.map((sub) => (
            <View key={sub.id} style={styles.subcategoriaItem}>
              <Text style={styles.subcategoriaName}>{sub.nombre}</Text>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => handleDeleteSubcategoria(sub.id as number)}
                iconColor="#FF3B30"
              />
            </View>
          ))}
          <Button
            mode="outlined"
            icon="plus"
            onPress={() =>
              navigation.navigate("CreateSubcategory", { categoryId })
            }
            style={styles.addSubcategoriaButton}
          >
            Agregar Subcategoría
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={handleUpdate}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Guardar Cambios
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  colorSection: {
    marginBottom: 20,
  },
  colorPicker: {
    height: 300,
    marginTop: 10,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  colorPickerButton: {
    marginTop: 10,
  },
  iconSection: {
    marginBottom: 20,
  },
  selectedIcon: {
    alignSelf: "center",
    margin: 10,
  },
  iconList: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  iconOption: {
    margin: 5,
  },
  subcategoriasSection: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  subcategoriaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subcategoriaName: {
    fontSize: 16,
  },
  addSubcategoriaButton: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    padding: 5,
  },
});
