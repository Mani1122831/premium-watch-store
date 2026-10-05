import { User } from '../types/user';

export const authService = {
  login: async (email: string, _password: string): Promise<User | null> => {
    if (!email.includes('@')) return null;
    return { id: 'u001', name: email.split('@')[0], email };
  },

  logout: () => {
    localStorage.removeItem('titanova_user');
  },

  getCurrentUser: (): User | null => {
    try {
      const saved = localStorage.getItem('titanova_user');
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      return null;
    }
  },
};
