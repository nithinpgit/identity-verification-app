import { AnimatePresence, motion } from 'framer-motion';
import { useVerificationFlow } from './hooks/useVerificationFlow';
import { SplashScreen } from './components/SplashScreen';
import { LivenessStep } from './components/LivenessStep';
import { PhotoCaptureStep } from './components/PhotoCaptureStep';
import { IDCaptureStep } from './components/IDCaptureStep';
import { FaceMatchStep } from './components/FaceMatchStep';
import { VoiceVerifyStep } from './components/VoiceVerifyStep';
import { EyeBlinkStep } from './components/EyeBlinkStep';
import { SuccessScreen } from './components/SuccessScreen';

const pageVariants = {
  initial: { opacity: 0, x: 60, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -60, scale: 0.96 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.4,
};

function App() {
  const { currentStep, progress, goNext, goBack, reset } = useVerificationFlow();

  return (
    <div className="h-screen w-screen overflow-hidden bg-pixl-navy">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="h-full w-full"
        >
          {currentStep === 'splash' && <SplashScreen onStart={goNext} />}
          {currentStep === 'liveness' && (
            <LivenessStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'photo-capture' && (
            <PhotoCaptureStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'id-capture' && (
            <IDCaptureStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'face-match' && (
            <FaceMatchStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'voice-verify' && (
            <VoiceVerifyStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'eye-blink' && (
            <EyeBlinkStep onComplete={goNext} onBack={goBack} progress={progress} />
          )}
          {currentStep === 'success' && <SuccessScreen onRestart={reset} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
