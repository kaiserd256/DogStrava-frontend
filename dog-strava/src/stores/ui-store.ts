import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types for UI state
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Modal {
  id: string
  type: string
  props?: Record<string, any>
  onClose?: () => void
}

export interface LoadingState {
  [key: string]: boolean
}

interface UiState {
  // Toast notifications
  toasts: Toast[]
  
  // Modal management
  modals: Modal[]
  
  // Loading states for different operations
  loading: LoadingState
  
  // Form states
  forms: Record<string, {
    isDirty: boolean
    isSubmitting: boolean
    errors: Record<string, string>
  }>
  
  // Search and filters
  searchQueries: Record<string, string>
  activeFilters: Record<string, any>
  
  // UI preferences (persisted)
  preferences: {
    compactMode: boolean
    showAvatars: boolean
    autoPlayVideos: boolean
    reducedMotion: boolean
  }
}

interface UiActions {
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  // Loading actions
  setLoading: (key: string, isLoading: boolean) => void
  clearLoading: () => void
  
  // Form actions
  setFormState: (formId: string, state: Partial<UiState['forms'][string]>) => void
  resetForm: (formId: string) => void
  clearForms: () => void
  
  // Search and filter actions
  setSearchQuery: (key: string, query: string) => void
  setActiveFilters: (key: string, filters: any) => void
  clearSearch: (key: string) => void
  clearFilters: (key: string) => void
  
  // Preference actions
  updatePreferences: (preferences: Partial<UiState['preferences']>) => void
  resetPreferences: () => void
}

const defaultPreferences: UiState['preferences'] = {
  compactMode: false,
  showAvatars: true,
  autoPlayVideos: false,
  reducedMotion: false,
}

export const useUiStore = create<UiState & UiActions>()(
  persist(
    (set, get) => ({
      // Initial state
      toasts: [],
      modals: [],
      loading: {},
      forms: {},
      searchQueries: {},
      activeFilters: {},
      preferences: defaultPreferences,

      // Toast actions
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id }
        
        set((state) => ({
          toasts: [...state.toasts, newToast]
        }))

        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, toast.duration || 5000)
        }
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        }))
      },

      clearToasts: () => {
        set({ toasts: [] })
      },

      // Modal actions
      openModal: (modal) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newModal = { ...modal, id }
        
        set((state) => ({
          modals: [...state.modals, newModal]
        }))
      },

      closeModal: (id) => {
        set((state) => {
          const modal = state.modals.find(m => m.id === id)
          if (modal?.onClose) {
            modal.onClose()
          }
          return {
            modals: state.modals.filter(m => m.id !== id)
          }
        })
      },

      closeAllModals: () => {
        const { modals } = get()
        modals.forEach(modal => {
          if (modal.onClose) {
            modal.onClose()
          }
        })
        set({ modals: [] })
      },

      // Loading actions
      setLoading: (key, isLoading) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: isLoading
          }
        }))
      },

      clearLoading: () => {
        set({ loading: {} })
      },

      // Form actions
      setFormState: (formId, formState) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [formId]: {
              ...state.forms[formId],
              ...formState
            }
          }
        }))
      },

      resetForm: (formId) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [formId]: {
              isDirty: false,
              isSubmitting: false,
              errors: {}
            }
          }
        }))
      },

      clearForms: () => {
        set({ forms: {} })
      },

      // Search and filter actions
      setSearchQuery: (key, query) => {
        set((state) => ({
          searchQueries: {
            ...state.searchQueries,
            [key]: query
          }
        }))
      },

      setActiveFilters: (key, filters) => {
        set((state) => ({
          activeFilters: {
            ...state.activeFilters,
            [key]: filters
          }
        }))
      },

      clearSearch: (key) => {
        set((state) => {
          const newSearchQueries = { ...state.searchQueries }
          delete newSearchQueries[key]
          return { searchQueries: newSearchQueries }
        })
      },

      clearFilters: (key) => {
        set((state) => {
          const newActiveFilters = { ...state.activeFilters }
          delete newActiveFilters[key]
          return { activeFilters: newActiveFilters }
        })
      },

      // Preference actions
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }))
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences })
      },
    }),
    {
      name: 'dogstrava-ui-store',
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist temporary UI state
      }),
    }
  )
)

// Convenience hooks for common UI operations
export const useToasts = () => {
  const { toasts, addToast, removeToast, clearToasts } = useUiStore()
  
  const showSuccess = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }
  
  const showError = (title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 })
  }
  
  const showWarning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }
  
  const showInfo = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }
  
  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts,
  }
}

export const useModals = () => {
  const { modals, openModal, closeModal, closeAllModals } = useUiStore()
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  }
}

export const useLoading = () => {
  const { loading, setLoading, clearLoading } = useUiStore()
  
  const isLoading = (key?: string) => {
    if (key) return loading[key] || false
    return Object.values(loading).some(Boolean)
  }
  
  return {
    loading,
    isLoading,
    setLoading,
    clearLoading,
  }
}
