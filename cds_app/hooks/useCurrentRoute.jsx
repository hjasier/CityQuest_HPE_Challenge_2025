import { create } from 'zustand';

// Create a store to manage current route globally
export const useCurrentRouteStore = create((set) => ({
  currentRoute: null,
  setCurrentRoute: (route) => set({ currentRoute: route }),
  clearCurrentRoute: () => set({ currentRoute: null })
}));

// Hook to use current route
export const useCurrentRoute = () => {
  const { currentRoute, setCurrentRoute, clearCurrentRoute } = useCurrentRouteStore();
  
  return {
    currentRoute,
    setCurrentRoute,
    clearCurrentRoute
  };
};