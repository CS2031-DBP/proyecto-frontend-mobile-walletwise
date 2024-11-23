export const COLORS = {
  primary: "rgb(189, 156, 115)", // Beige principal
  secondary: "#FFFFFF", // Blanco
  text: "#000000", // Negro para texto
  background: "rgb(189, 156, 115)", // Beige para fondos
  surface: "#FFFFFF", // Blanco para superficies
  disabled: "rgba(0, 0, 0, 0.26)",
  error: "#B00020",
  accent: "#000000", // Negro para acentos
  border: "#DDDDDD", // Color para bordes
};

// Puedes añadir también estilos comunes que se reutilizarán
export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  input: {
    backgroundColor: COLORS.surface,
    marginBottom: 15,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.secondary,
    textAlign: "center",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
  },
};
