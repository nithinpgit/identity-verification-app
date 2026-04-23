import { useState, useCallback } from 'react';

export type Step =
  | 'splash'
  | 'liveness'
  | 'photo-capture'
  | 'id-capture'
  | 'face-match'
  | 'voice-verify'
  | 'eye-blink'
  | 'success';

const STEPS: Step[] = [
  'splash',
  'liveness',
  'photo-capture',
  'id-capture',
  'face-match',
  'voice-verify',
  'eye-blink',
  'success',
];

export function useVerificationFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('splash');

  const stepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length - 2;
  const progressIndex = Math.max(0, stepIndex - 1);
  const progress = currentStep === 'success' ? 100 : (progressIndex / totalSteps) * 100;

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep('splash');
  }, []);

  return { currentStep, stepIndex, progress, goNext, goBack, reset };
}
