import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { useOnboardingStore } from '../../store/useOnboardingStore';

import { Step1Splash } from "./Step1Splash.tsx";
import { Step2Role } from "./Step2Role.tsx";
import { Step3Industries } from "./Step3Industries.tsx";
import { Step5Notifications } from "./Step5Notifications.tsx";
import { Step6Workspace } from "./Step6Workspace.tsx";
import { Step7Success } from "./Step7Success.tsx";

export const OnboardingFlow: React.FC = () => {
  const onboardingStep = useOnboardingStore(state => state.onboardingStep);
  const setOnboardingStep = useOnboardingStore(state => state.setOnboardingStep);
  const completeOnboarding = useOnboardingStore(state => state.completeOnboarding);

  const totalSteps = 6;
  const progressPercentage =
    ((onboardingStep - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    setOnboardingStep(Math.min(onboardingStep + 1, totalSteps));
  };

  const handleBack = () => {
    setOnboardingStep(Math.max(onboardingStep - 1, 1));
  };

  const handleSkip = () => {
    if (onboardingStep === 1) {
      completeOnboarding();
    } else {
      handleNext();
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-background text-body flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl" />

      {onboardingStep > 1 && onboardingStep < totalSteps && (
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <m.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">

          {onboardingStep === 1 && (
            <Step1Splash
              key="step1"
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}

          {onboardingStep === 2 && (
            <Step2Role
              key="step2"
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {onboardingStep === 3 && (
            <Step3Industries
              key="step3"
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {onboardingStep === 4 && (
            <Step5Notifications
              key="step4"
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {onboardingStep === 5 && (
            <Step6Workspace
              key="step5"
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {onboardingStep === 6 && (
            <Step7Success
              key="step6"
              onComplete={handleComplete}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

