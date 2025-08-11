import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, username: string, accountType: 'owner' | 'rescue') => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement Cognito login
          console.log('Login attempt:', { email });
          // Placeholder - replace with actual Cognito integration
          throw new Error('Authentication not yet implemented');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
        }
      },

      register: async (email, password, username, accountType) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement Cognito registration
          console.log('Register attempt:', { email, username, accountType });
          // Placeholder - replace with actual Cognito integration
          throw new Error('Registration not yet implemented');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
        // TODO: Clear Cognito session
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
