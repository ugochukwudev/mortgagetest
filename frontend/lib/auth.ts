import Cookies from 'js-cookie';
import { User } from '@/types/user';
import { AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const auth = {
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return Cookies.get(TOKEN_KEY) || null;
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      Cookies.remove(TOKEN_KEY, { path: '/' });
    }
  },

  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
    }
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = Cookies.get(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  removeUser: (): void => {
    if (typeof window !== 'undefined') {
      Cookies.remove(USER_KEY, { path: '/' });
    }
  },

  clear: (): void => {
    auth.removeToken();
    auth.removeUser();
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};

export const handleAuthResponse = (response: AuthResponse): void => {
  auth.setToken(response.token);
  auth.setUser(response.user);
};

