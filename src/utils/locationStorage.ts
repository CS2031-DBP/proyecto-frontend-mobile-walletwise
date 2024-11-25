import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationData {
  [transactionId: number]: {
    latitude: number;
    longitude: number;
    direccion?: string;
  };
}

export const locationStorage = {
  async saveLocation(
    transactionId: number,
    location: {
      latitude: number;
      longitude: number;
      direccion?: string;
    }
  ) {
    try {
      console.log(
        "Iniciando guardado de ubicación para transacción:",
        transactionId
      );
      const currentData = await this.getAllLocations();
      console.log("Datos actuales:", currentData);

      const newData = {
        ...currentData,
        [transactionId]: location,
      };
      console.log("Nuevos datos a guardar:", newData);

      await AsyncStorage.setItem(
        "transaction_locations",
        JSON.stringify(newData)
      );
      console.log("Ubicación guardada exitosamente");
    } catch (error) {
      console.error("Error saving location:", error);
    }
  },

  async getLocation(transactionId: number) {
    try {
      console.log("Obteniendo ubicación para transacción:", transactionId);
      const data = await this.getAllLocations();
      console.log("Datos almacenados:", data);
      console.log("Ubicación encontrada:", data[transactionId]);
      return data[transactionId];
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  },

  async getAllLocations(): Promise<LocationData> {
    try {
      const data = await AsyncStorage.getItem("transaction_locations");
      console.log("Obteniendo todas las ubicaciones:", data);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error getting all locations:", error);
      return {};
    }
  },
};
