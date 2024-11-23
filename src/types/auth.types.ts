export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  nombre: string;
}

// auth.types.ts
export interface User {
  id: number;
  nombre: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  token: string;
  role: string;
  id: number;
  nombre: string;
  email: string;
}
