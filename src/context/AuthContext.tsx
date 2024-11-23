import React, { createContext, useState, useContext } from "react";
import { AuthResponse, User } from "../types/auth.types";
import { saveToken, removeToken } from "../utils/tokenStorage";

interface AuthContextType {
  user: User | null;
  login: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // En AuthContext.tsx
  const login = async (response: AuthResponse) => {
    try {
      console.log("AuthContext: Procesando login con:", response);

      if (!response.token) {
        throw new Error("Token no encontrado en la respuesta");
      }

      await saveToken(response.token);

      const userObj: User = {
        id: response.id, // Asegúrate de que response.id existe
        nombre: response.nombre,
        email: response.email,
        role: response.role,
        isAuthenticated: true,
      };

      setUser(userObj);
      console.log("AuthContext: Usuario establecido:", userObj);
    } catch (error) {
      console.error("Error en AuthContext login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
