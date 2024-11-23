// src/screens/auth/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator, // Añadimos esto para feedback visual
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth.api";

export const RegisterScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Añadimos estado de carga
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando registro...");
      const response = await authApi.register({
        nombre: nombre.trim(),
        email: email.trim(),
        password: password,
      });
      console.log("Registro exitoso, procediendo con login...");
      await login(response);
      console.log("Login completado, debería redirigir al dashboard...");
      // La navegación se manejará automáticamente por el estado de autenticación en App.tsx
    } catch (error: any) {
      console.error("Error en registro:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo completar el registro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#87b7f7",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
  },
});
