export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
