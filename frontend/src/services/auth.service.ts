import { AuthResponse, LoginCredentials } from '../interfaces/auth.interface';
import { ToastService } from './toast.service';

const API_URL = 'http://localhost:3000';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      ToastService.error('Email e senha são obrigatórios');
      throw new Error('Email e senha são obrigatórios');
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      ToastService.success('Login realizado com sucesso!');
      return data;
    } catch (error) {
      ToastService.error(error.error.message ?? 'Erro ao fazer login.');
      throw error;
    }
  },

  async register(userData: { email: string; password: string; name: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      ToastService.success('Conta criada com sucesso!');
      return data;
    } catch (error) {
      ToastService.errorApi(error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('token');
      const user = this.getUser();
      return !!(token && user);
    } catch (error) {
      this.logout();
      return false;
    }
  },

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      this.logout();
      return null;
    }
  }
};
