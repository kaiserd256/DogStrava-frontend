import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { cognitoAuth } from '@/lib/auth';
import { mockAuth } from '@/lib/mock-auth';

// Use mock auth while AWS account is being activated
// Force mock auth for now since AWS account is pending activation
const USE_MOCK_AUTH = true; // Temporarily force mock auth
console.log('🔧 Auth Service Debug:', { 
  NODE_ENV: process.env.NODE_ENV, 
  USE_MOCK_AUTH_ENV: process.env.NEXT_PUBLIC_USE_MOCK_AUTH,
  USE_MOCK_AUTH,
  authService: USE_MOCK_AUTH ? 'mockAuth' : 'cognitoAuth'
});
const authService = USE_MOCK_AUTH ? mockAuth : cognitoAuth;

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
          const result = await authService.signIn(email, password);
          
          if (result.isSignedIn && result.user) {
            // Convert Cognito user to our User type
            const user: User = {
              id: result.user.userId,
              email: result.user.signInDetails?.loginId || email,
              username: result.user.username,
              accountType: 'owner', // Default, will be updated from user attributes
              isPrivate: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
          } else {
            set({ 
              error: 'Login failed - please check your credentials',
              isLoading: false 
            });
          }
        } catch (error: any) {
          let errorMessage = 'Login failed';
          
          if (error.name === 'NotAuthorizedException') {
            errorMessage = 'Invalid email or password';
          } else if (error.name === 'UserNotConfirmedException') {
            errorMessage = 'Please check your email and confirm your account';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
        }
      },

      register: async (email, password, username, accountType) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.signUp(email, password, username, accountType);
          
          if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
            set({ 
              error: null,
              isLoading: false 
            });
            // You might want to redirect to confirmation page here
            alert('Registration successful! Please check your email for a confirmation code.');
          }
        } catch (error: any) {
          let errorMessage = 'Registration failed';
          
          if (error.name === 'UsernameExistsException') {
            errorMessage = 'An account with this email already exists';
          } else if (error.name === 'InvalidPasswordException') {
            errorMessage = 'Password does not meet requirements';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
        }
      },

      logout: async () => {
        try {
          await authService.signOut();
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Force logout even if Cognito call fails
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        }
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
