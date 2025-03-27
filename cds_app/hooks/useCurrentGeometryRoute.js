import { create } from 'zustand';

// Create a store to manage current geometryRoute globally
export const useCurrentGeometryRouteStore = create((set) => ({
  currentGeometryRoute: null,
  setCurrentGeometryRoute: (geometryRoute) => set({ currentGeometryRoute: geometryRoute }),
  clearCurrentGeometryRoute: () => set({ currentGeometryRoute: null })
}));

// Hook to use current geometryRoute
export const useCurrentGeometryRoute = () => {
  const { currentGeometryRoute, setCurrentGeometryRoute, clearCurrentGeometryRoute } = useCurrentGeometryRouteStore();
  
  return {
    currentGeometryRoute,
    setCurrentGeometryRoute,
    clearCurrentGeometryRoute
  };
};