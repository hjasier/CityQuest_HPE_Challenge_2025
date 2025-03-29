import { create } from 'zustand';

// Create a store to manage selected location globally
export const useSelectedLocationStore = create((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearSelectedLocation: () => set({ selectedLocation: null })
}));

// Hook to use selected location
export const useSelectedLocation = () => {
  const { selectedLocation, setSelectedLocation, clearSelectedLocation } = useSelectedLocationStore();
  
  return {
    selectedLocation,
    setSelectedLocation,
    clearSelectedLocation
  };
};