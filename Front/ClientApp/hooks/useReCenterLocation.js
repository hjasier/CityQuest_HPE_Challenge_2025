import { create } from 'zustand';

// Create a store to manage ReCenter location globally
export const useReCenterLocationStore = create((set) => ({
    ReCenterLocation: false,
    reCenterLoc: () => set((state) => {
        const newState = !state.ReCenterLocation;
        console.log(`ReCenterLocation ha cambiado a: ${newState}`);
        return { ReCenterLocation: newState };
    }),
}));

// Hook to use ReCenter location
export const useReCenterLocation = () => {
    const { ReCenterLocation, reCenterLoc } = useReCenterLocationStore();
    
    return {
        ReCenterLocation, // Devuelve el estado actual
        reCenterLoc       // Devuelve la función para cambiarlo
    };
};
