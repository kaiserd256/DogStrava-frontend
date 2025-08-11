import { create } from 'zustand';
import { Dog } from '@/types';

interface UserState {
  dogs: Dog[];
  selectedDogId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setDogs: (dogs: Dog[]) => void;
  addDog: (dog: Dog) => void;
  updateDog: (dogId: string, updates: Partial<Dog>) => void;
  removeDog: (dogId: string) => void;
  setSelectedDog: (dogId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserDogs: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  // State
  dogs: [],
  selectedDogId: null,
  isLoading: false,
  error: null,

  // Actions
  setDogs: (dogs) => set({ dogs }),

  addDog: (dog) => set((state) => ({ 
    dogs: [...state.dogs, dog] 
  })),

  updateDog: (dogId, updates) => set((state) => ({
    dogs: state.dogs.map(dog => 
      dog.id === dogId ? { ...dog, ...updates } : dog
    )
  })),

  removeDog: (dogId) => set((state) => ({
    dogs: state.dogs.filter(dog => dog.id !== dogId),
    selectedDogId: state.selectedDogId === dogId ? null : state.selectedDogId
  })),

  setSelectedDog: (dogId) => set({ selectedDogId: dogId }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  fetchUserDogs: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to fetch user's dogs
      console.log('Fetching user dogs...');
      // Placeholder - replace with actual API integration
      set({ dogs: [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dogs',
        isLoading: false 
      });
    }
  },
}));
