// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RegisterScreen } from "./src/screens/auth/RegisterScreen";
import { DashboardScreen } from "./src/screens/app/DashboardScreen";
import { CreateCuentaScreen } from "./src/screens/app/CreateCuentaScreen";
import { IconButton } from "react-native-paper";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // Rutas autenticadas
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              headerShown: true,
              title: "WalletWise",
              headerRight: () => (
                <IconButton icon="logout" size={24} onPress={logout} />
              ),
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="CreateCuenta"
            component={CreateCuentaScreen}
            options={{
              headerShown: true,
              title: "Nueva Cuenta",
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </>
      ) : (
        // Rutas no autenticadas
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
