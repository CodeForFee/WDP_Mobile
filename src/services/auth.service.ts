import api from './api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'franchise' | 'kitchen' | 'coordinator';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Mock implementation for development
    // In production: return api.post('/auth/login', { email, password });

    return new Promise((resolve) => {
      setTimeout(() => {
        let role: User['role'] = 'franchise';
        if (email.includes('kitchen')) role = 'kitchen';
        if (email.includes('coord')) role = 'coordinator';

        resolve({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email,
            name: 'Demo User',
            role,
          },
        });
      }, 500);
    });
  },

  logout: async () => {
    // In production: return api.post('/auth/logout');
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User | null> => {
    // In production: return api.get('/auth/me');
    return Promise.resolve(null);
  },
};
