import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RegisterScreen } from "./src/screens/auth/RegisterScreen";
import { DashboardScreen } from "./src/screens/app/DashboardScreen";
import { AccountsScreen } from "./src/screens/AccountsScreen";
import { CreateCuentaScreen } from "./src/screens/app/CreateCuentaScreen";
import { CuentaDetailsScreen } from "./src/screens/app/CuentaDetailsScreen";
import { TransactionDetailsScreen } from "./src/screens/TransactionDetailsScreen";
import { TransactionsScreen } from "./src/screens/TransactionsScreen";
import { CreateTransactionScreen } from "./src/screens/CreateTransactionScreen";
import { CategoriesScreen } from "./src/screens/app/CategoriesScreen";
import { CreateCategoryScreen } from "./src/screens/app/CreateCategoryScreen";
import { EditCategoryScreen } from "./src/screens/app/EditCategoryScreen";
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
            name="Accounts"
            component={AccountsScreen}
            options={{
              headerShown: true,
              title: "Mis Cuentas",
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
            options={{
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
            }}
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
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetailsScreen}
            options={{
              headerShown: true,
              title: "Detalles de Transacción",
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
            name="Categories"
            component={CategoriesScreen}
            options={{
              headerShown: true,
              title: "Categorías",
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
            name="CreateCategory"
            component={CreateCategoryScreen}
            options={{
              headerShown: true,
              title: "Nueva Categoría",
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
            name="EditCategory"
            component={EditCategoryScreen}
            options={{
              headerShown: true,
              title: "Editar Categoría",
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
