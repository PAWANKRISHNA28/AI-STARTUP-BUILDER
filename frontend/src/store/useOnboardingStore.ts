import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingStep: 1,
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingStep: -1 }),
    }),
    { name: 'onboarding-storage' }
  )
);
