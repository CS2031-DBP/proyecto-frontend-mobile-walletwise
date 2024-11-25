// src/screens/app/CategoriesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { FAB } from "react-native-paper";
import { CategoriaCard } from "../../components/CategoriaCard";
import { categoriaApi } from "../../api/categoria.api";
import { Categoria } from "../../types/categoria.types";

export const CategoriesScreen = ({ navigation }: any) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      const response = await categoriaApi.getMisCategorias();
      setCategorias(response);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoria = async (categoriaId: number) => {
    Alert.alert(
      "Eliminar Categoría",
      "¿Estás seguro de que deseas eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await categoriaApi.deleteCategoria(categoriaId);
              loadCategorias();
            } catch (error) {
              console.error("Error eliminando categoría:", error);
              Alert.alert("Error", "No se pudo eliminar la categoría");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCategorias();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadCategorias} />
        }
      >
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onDelete={() => handleDeleteCategoria(categoria.id as number)}
          />
        ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("CreateCategory")}
        label="Nueva Categoría"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
});
