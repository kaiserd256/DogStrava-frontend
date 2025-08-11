// Authentication utilities and Cognito integration
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import type { SignInInput, SignUpInput } from 'aws-amplify/auth';

export interface CognitoConfig {
  userPoolId: string;
  userPoolClientId: string;
  region: string;
}

// Configuration from environment variables
export const cognitoConfig: CognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
};

// Auth utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('auth-token');
    return !!token && !this.isTokenExpired(token);
  },

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  // Store auth token
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  },

  // Remove auth token
  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
  },

  // Get stored auth token
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  },

  // Parse user from token
  getUserFromToken(token: string): any | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },
};

// Cognito integration functions using AWS Amplify Auth
export const cognitoAuth = {
  async signIn(email: string, password: string) {
    try {
      const signInInput: SignInInput = {
        username: email,
        password: password,
      };
      
      const { isSignedIn, nextStep } = await signIn(signInInput);
      
      if (isSignedIn) {
        const user = await getCurrentUser();
        return {
          user,
          isSignedIn,
          nextStep
        };
      }
      
      return { isSignedIn, nextStep };
    } catch (error) {
      console.error('Cognito sign in error:', error);
      throw error;
    }
  },

  async signUp(email: string, password: string, username: string, accountType: string) {
    try {
      const signUpInput: SignUpInput = {
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            preferred_username: username,
            'custom:account_type': accountType,
          },
        },
      };
      
      const { isSignUpComplete, userId, nextStep } = await signUp(signUpInput);
      
      return {
        isSignUpComplete,
        userId,
        nextStep,
      };
    } catch (error) {
      console.error('Cognito sign up error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut();
      authUtils.removeAuthToken();
    } catch (error) {
      console.error('Cognito sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async confirmSignUp(email: string, code: string) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      return { isSignUpComplete, nextStep };
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  },

  async resendConfirmationCode(email: string) {
    try {
      await resendSignUpCode({
        username: email,
      });
    } catch (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const { nextStep } = await resetPassword({
        username: email,
      });
      
      return { nextStep };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  async confirmPassword(email: string, code: string, newPassword: string) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  },
};
