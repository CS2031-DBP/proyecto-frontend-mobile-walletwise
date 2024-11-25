// src/components/CategoriaCard.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { Categoria } from "../types/categoria.types";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types/navigation.types";

interface CategoriaCardProps {
  categoria: Categoria;
  onDelete?: () => void;
}

export const CategoriaCard = ({ categoria, onDelete }: CategoriaCardProps) => {
  const navigation = useNavigation<NavigationProps["navigation"]>();

  const handlePress = () => {
    navigation.navigate("EditCategory", {
      categoryId: categoria.id as number,
    });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content style={styles.content}>
        <IconButton
          icon={categoria.icono || "folder"}
          size={24}
          iconColor={categoria.color || "#007AFF"}
          style={styles.icon}
        />
        <Text style={styles.title}>{categoria.nombre}</Text>
        {categoria.descripcion && (
          <Text style={styles.description}>{categoria.descripcion}</Text>
        )}
        {onDelete && (
          <IconButton
            icon="delete"
            size={20}
            onPress={onDelete}
            iconColor="#FF3B30"
            style={styles.deleteButton}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  icon: {
    margin: 0,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  deleteButton: {
    margin: 0,
  },
});
