// Mock authentication for testing while AWS account is being activated
import { User } from '@/types';

// Mock user data for testing
const mockUsers = [
  {
    email: 'test@dogstrava.com',
    password: 'password123',
    user: {
      id: 'mock-user-1',
      email: 'test@dogstrava.com',
      username: 'testuser',
      accountType: 'owner' as const,
      isPrivate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
];

export const mockAuth = {
  async signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }
    
    return {
      isSignedIn: true,
      user: {
        userId: mockUser.user.id,
        username: mockUser.user.username,
        signInDetails: {
          loginId: email
        }
      },
      nextStep: null
    };
  },

  async signUp(email: string, password: string, username: string, accountType: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }
    
    // In real implementation, this would create the user
    return {
      isSignUpComplete: false,
      userId: 'mock-user-new',
      nextStep: {
        signUpStep: 'CONFIRM_SIGN_UP'
      }
    };
  },

  async signOut() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  async getCurrentUser() {
    throw new Error('Not implemented in mock');
  },

  async confirmSignUp(email: string, code: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (code !== '123456') {
      throw new Error('Invalid confirmation code');
    }
    
    return {
      isSignUpComplete: true,
      nextStep: null
    };
  },

  async resendConfirmationCode(email: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  async forgotPassword(email: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { nextStep: null };
  },

  async confirmPassword(email: string, code: string, newPassword: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },
};
