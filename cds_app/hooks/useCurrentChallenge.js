import { create } from 'zustand';

// Create a store to manage current challenge globally
export const useCurrentChallengeStore = create((set) => ({
  currentChallenge: null,
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  clearCurrentChallenge: () => set({ currentChallenge: null })
}));

// Hook to use current challenge
export const useCurrentChallenge = () => {
  const { currentChallenge, setCurrentChallenge, clearCurrentChallenge } = useCurrentChallengeStore();
  
  return {
    currentChallenge,
    setCurrentChallenge,
    clearCurrentChallenge
  };
};