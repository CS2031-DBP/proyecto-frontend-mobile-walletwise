// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RegisterScreen } from "./src/screens/auth/RegisterScreen";
import { DashboardScreen } from "./src/screens/app/DashboardScreen";
import { CreateCuentaScreen } from "./src/screens/app/CreateCuentaScreen";
import { CuentaDetailsScreen } from "./src/screens/app/CuentaDetailsScreen";
import { TransactionsScreen } from "./src/screens/TransactionsScreen";
import { CreateTransactionScreen } from "./src/screens/CreateTransactionScreen";
import { IconButton } from "react-native-paper";
import { RootStackParamList } from "./src/types/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
                <IconButton
                  icon="logout"
                  size={24}
                  onPress={logout}
                  iconColor="#007AFF"
                />
              ),
              headerLeft: () => null,
              headerTitleStyle: {
                color: "#000",
                fontSize: 20,
                fontWeight: "bold",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerShadowVisible: true,
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
              headerTitleStyle: {
                color: "#000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerShadowVisible: true,
            }}
          />
          <Stack.Screen
            name="CuentaDetails"
            component={CuentaDetailsScreen}
            options={({ route }) => ({
              headerShown: true,
              title: "Detalles de Cuenta",
              animation: "slide_from_right",
              headerTitleStyle: {
                color: "#000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerShadowVisible: true,
              headerBackTitle: "Volver",
              headerTintColor: "#007AFF",
            })}
          />
          <Stack.Screen
            name="Transactions"
            component={TransactionsScreen}
            options={{
              headerShown: true,
              title: "Transacciones",
              animation: "slide_from_right",
              headerTitleStyle: {
                color: "#000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerShadowVisible: true,
              headerBackTitle: "Volver",
              headerTintColor: "#007AFF",
            }}
          />
          <Stack.Screen
            name="CreateTransaction"
            component={CreateTransactionScreen}
            options={{
              headerShown: true,
              title: "Nueva Transacción",
              presentation: "modal",
              animation: "slide_from_bottom",
              headerTitleStyle: {
                color: "#000",
                fontSize: 18,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerShadowVisible: true,
            }}
          />
        </>
      ) : (
        // Rutas no autenticadas
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
