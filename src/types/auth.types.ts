export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  nombre: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  role: string;
}
