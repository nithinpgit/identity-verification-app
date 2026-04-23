import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';
import { Camera, RotateCcw, CheckCircle2 } from 'lucide-react';
import { CameraFeed } from './CameraFeed';

interface PhotoCaptureStepProps {
  onComplete: () => void;
  onBack: () => void;
  progress: number;
}

export function PhotoCaptureStep({ onComplete, onBack, progress }: PhotoCaptureStepProps) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'captured' | 'done'>('ready');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase === 'countdown') {
      if (count > 0) {
        const t = setTimeout(() => setCount((c) => c - 1), 800);
        return () => clearTimeout(t);
      } else {
        setPhase('captured');
        setTimeout(() => setPhase('done'), 1200);
        setTimeout(onComplete, 2000);
      }
    }
  }, [phase, count, onComplete]);

  const handleCapture = () => {
    setPhase('countdown');
    setCount(3);
  };

  return (
    <StepLayout
      title="Selfie Capture"
      subtitle="Position your face within the frame and hold still"
      stepNumber={2}
      progress={progress}
      onBack={onBack}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="absolute -inset-3 pointer-events-none z-10">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-pixl-cyan rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-pixl-cyan rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-pixl-cyan rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-pixl-cyan rounded-br-xl" />
          </div>
          {phase === 'ready' && (
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 rounded-[2rem] border border-pixl-cyan/40 z-10"
            />
          )}
          <div className="w-72 h-[22rem] rounded-3xl bg-pixl-surface/40 backdrop-blur-sm border border-white/5 overflow-hidden flex items-center justify-center relative">
            <CameraFeed className="absolute inset-0 w-full h-full object-cover" mirrored />
            <AnimatePresence>
              {phase === 'captured' && (
                <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-white z-20" />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {phase === 'done' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-pixl-success/10 flex items-center justify-center z-20">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 size={52} className="text-pixl-success" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {phase === 'countdown' && count > 0 && (
                <motion.div key={count} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
                  <span className="text-6xl font-bold text-white">{count}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {phase === 'ready' && (
          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCapture} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pixl-blue to-pixl-cyan text-white font-semibold shadow-lg shadow-pixl-cyan/20">
            <Camera size={18} />
            Take Selfie
          </motion.button>
        )}
        {phase === 'done' && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex gap-3">
            <button onClick={() => setPhase('ready')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pixl-surface/60 border border-white/5 text-pixl-muted text-sm">
              <RotateCcw size={14} />
              Retake
            </button>
          </motion.div>
        )}
      </div>
    </StepLayout>
  );
}
